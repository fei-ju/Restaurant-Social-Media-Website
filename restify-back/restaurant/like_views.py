from django.contrib import admin
from django.urls import path, include
from rest_framework import routers, status
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.shortcuts import get_object_or_404
from rest_framework import mixins, serializers, viewsets
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, \
    UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from restaurant.models import Restaurant,LikeRestaurant,Follow
from restaurant.helpers import *




class LikeRestaurantSerializer(serializers.ModelSerializer):
    like_restaurant_to_id = serializers.IntegerField(write_only=True)
    like_restaurant_to = serializers.IntegerField(read_only=True,source='like_restaurant_to.id')
    like_restaurant_by = serializers.IntegerField(source='like_restaurant_by.id', read_only=True)


    class Meta:
        model = LikeRestaurant
        fields = ['id','like_restaurant_to','like_restaurant_by','like_restaurant_time','like_restaurant_to_id']

class LikeRestaurantView(mixins.CreateModelMixin,
                         mixins.ListModelMixin,
                         mixins.DestroyModelMixin,
                         GenericViewSet):

    
    serializer_class = LikeRestaurantSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        queryset = LikeRestaurant.objects.filter(like_restaurant_by = self.request.user.id).all()
        return queryset

    def perform_create(self, serializer):
        restaurant = Restaurant.objects.filter(id=serializer.validated_data["like_restaurant_to_id"])
        if not restaurant.exists():
            raise serializers.ValidationError("Restaurant does not exist")

        if LikeRestaurant.objects.filter(like_restaurant_to = restaurant.first(),like_restaurant_by=self.request.user).exists():
            raise serializers.ValidationError("Already liked")

        notify_users([restaurant.first().owner],0,"{} liked your restaurant! ".format(self.request.user.get_full_name()))
        serializer.save(like_restaurant_to = restaurant.first(),like_restaurant_by =self.request.user)

    def list(self, request, *args, **kwargs):
        '''Return all restaurants that this user has liked'''
        return super().list( request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        '''Likes a restaurant related to restaurantID'''
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        '''Unlikes a restaurant given by LikeID; The LikeID can be retrive by GET or POST'''
        return super().destroy(request, *args, **kwargs)

    def perform_destroy(self, instance):
        if (instance.like_restaurant_by != self.request.user):
            return Response(status=status.HTTP_403_FORBIDDEN)
        notify_users([instance.like_restaurant_to.owner],1,"{} unliked your restaurant! ".format(self.request.user.get_full_name()))
        instance.delete()

class LikeToRestaurantList(ListAPIView):
    serializer_class = LikeRestaurantSerializer
    def get_queryset(self):
        to = Restaurant.objects.filter(id = self.kwargs.get('restaurant_id'))
        queryset = LikeRestaurant.objects.filter(like_restaurant_to = to.first()).all()
        return queryset

    def get(self, request, *args, **kwargs):
        '''Returns all users that have liked this restaurant'''
        return super().list( request, *args, **kwargs)

# check if a user has liked a restaurant
class LikeToRestaurantDetail(RetrieveAPIView):
    serializer_class = LikeRestaurantSerializer
    permission_classes = [IsAuthenticated]
    queryset = LikeRestaurant.objects.all()
    def get_object(self):
        to = Restaurant.objects.filter(id = self.kwargs["pk"])
        queryset = LikeRestaurant.objects.filter(like_restaurant_to = to.first(),like_restaurant_by = self.request.user.id).first()
        return queryset

    def get(self, request, *args, **kwargs):
        '''Returns all users that have liked this restaurant'''
        return super().get( request, *args, **kwargs)

app_name = 'restaurant'

router = routers.DefaultRouter()
router.register(r'mylike', LikeRestaurantView,basename="like")
urlpatterns = [
    path('', include(router.urls)),
    path('all_like/<int:restaurant_id>/',LikeToRestaurantList.as_view(),name='LikeToRestaurantList'),
    path('check/<int:pk>/',LikeToRestaurantDetail.as_view(),name='LikeToRestaurantDetail2'),
]
