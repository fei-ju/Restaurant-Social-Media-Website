from django.shortcuts import get_object_or_404
from django.urls import include, path
from rest_framework import mixins, routers, serializers, viewsets
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, \
    UpdateAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from rest_framework.parsers import MultiPartParser
from restaurant.models import Restaurant,LikeRestaurant,Menu,Follow, PictureModel
from restaurant.helpers import *

class PictureSerializer(serializers.ModelSerializer):
    rest_owner = serializers.IntegerField(source='rest_owner.id', read_only=True)
    id = serializers.ReadOnlyField()
    restaurant_picture = serializers.ImageField()
    parser_classes = (MultiPartParser,)

    class Meta:
        model = PictureModel
        fields = ['id', 'restaurant_picture', 'rest_owner']


class PictureView(mixins.CreateModelMixin,
                         mixins.DestroyModelMixin,
                         GenericViewSet):
    serializer_class = PictureSerializer
    parser_classes = (MultiPartParser,)
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        my_restaurant = Restaurant.objects.filter(owner = self.request.user.id).first()
        return PictureModel.objects.filter(rest_owner = my_restaurant).all()

    def perform_create(self, serializer):
        if not Restaurant.objects.filter(owner=self.request.user).exists():
            raise serializers.ValidationError("No Restaurant exist")
        restaurant = Restaurant.objects.filter(owner=self.request.user).first()
        serializer.save(rest_owner=restaurant)

    def perform_destroy(self, instance):
        instance.delete()


    def create(self, request, *args, **kwargs):
        '''Upload a picture'''
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        '''Delete a picture'''
        return super().destroy(request, *args, **kwargs)

class AllPictureForARestaurantVIew(ListAPIView):
    '''Return All pictures from A restaurant(RestaurantID)'''

    serializer_class = PictureSerializer

    def get_queryset(self):
        queryset = PictureModel.objects.filter(rest_owner=self.kwargs['restaurant_id']).all()
        return queryset


app_name = 'restaurant'

router = routers.DefaultRouter()
router.register(r'picture', PictureView,basename="pictures")
urlpatterns = [
    path('', include(router.urls)),
    path('all_picture/<int:restaurant_id>/',AllPictureForARestaurantVIew.as_view(),name='ShowPicture'),
]

