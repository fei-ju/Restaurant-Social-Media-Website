from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.shortcuts import get_object_or_404
from rest_framework import mixins, serializers, viewsets
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, \
    UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from restaurant.models import Restaurant,LikeRestaurant,Follow
from restaurant.helpers import *



class FollowRestaurantSerializer(serializers.ModelSerializer):
    follow_to_id = serializers.IntegerField(write_only=True)
    follow_to = serializers.IntegerField(read_only=True,source='follow_to.id')
    follow_by = serializers.IntegerField(source='follow_by.id', read_only=True)

    class Meta:
        model = Follow
        fields = ['id','follow_to','follow_by','follow_time','follow_to_id']

class FollowRestaurantView(mixins.CreateModelMixin,
                         mixins.DestroyModelMixin,
                         mixins.ListModelMixin,
                         GenericViewSet):
    serializer_class = FollowRestaurantSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        queryset = Follow.objects.filter(follow_by = self.request.user.id).all()
        return queryset


    def perform_create(self, serializer):
        to = Restaurant.objects.filter(id=serializer.validated_data["follow_to_id"])

        if not to.exists():
            raise serializers.ValidationError("Restaurant does not exist")

        if Follow.objects.filter(follow_to = to.first(),follow_by=self.request.user.id).exists():
            raise serializers.ValidationError("Already followed")


        notify_users([to.first().owner],2,"{} followed your restaurant! ".format(self.request.user.get_full_name()))
        serializer.save(follow_to = to.first(),
                        follow_by =self.request.user)

    def perform_destroy(self, instance):
        notify_users([instance.follow_to.owner],3,"{} Unfollowed your restaurant! ".format(self.request.user.get_full_name()))
        instance.delete()


    def list(self, request, *args, **kwargs):
        '''Return All my followed restaurant'''
        return super().list( request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        '''follow the restaurant by the restaurantID'''
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        '''Unfollow the restaurant by the LikerestaurantID; The LikerestaurantID can be retrive by GET or POST'''
        return super().destroy(request, *args, **kwargs)


class FollowToRestaurantList(ListAPIView):
    serializer_class = FollowRestaurantSerializer
    def get_queryset(self):
        to = Restaurant.objects.filter(id = self.kwargs.get('restaurant_id'))
        queryset = Follow.objects.filter(follow_to = to.first()).all()
        return queryset

    def get(self, request, *args, **kwargs):
        '''Return All users that is following A restaurant'''
        return super().list( request, *args, **kwargs)


# check if the user is following the restaurant
class IsFollowingRestaurant(RetrieveAPIView):
    serializer_class = FollowRestaurantSerializer
    permission_classes = [IsAuthenticated]
    queryset = Follow.objects.all()
    def get_object(self):
        to = Restaurant.objects.filter(id = self.kwargs['pk'])
        print(self.kwargs['pk'],self.request.user.id)
        queryset = Follow.objects.filter(follow_to = to.first(),follow_by=self.request.user.id).first()
        return queryset
    

    def get(self, request, *args, **kwargs):
        '''Return True if the user is following the restaurant'''
        return super().get( request, *args, **kwargs)



app_name = 'restaurant'

router = routers.DefaultRouter()
router.register(r'follow', FollowRestaurantView,basename="follow")
urlpatterns = [
    path('', include(router.urls)),
    path('all_follow/<int:restaurant_id>/',FollowToRestaurantList.as_view(),name='FollowToRestaurantList'),
    path('is_following/<int:pk>/',IsFollowingRestaurant.as_view(),name='IsFollowingRestaurant'),
]
