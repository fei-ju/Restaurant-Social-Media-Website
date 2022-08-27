# -*- coding: utf-8 -*-
from django.shortcuts import get_object_or_404
from django.urls import include, path
from rest_framework import mixins, routers, serializers, viewsets
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, \
    UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from restaurant.models import Restaurant,LikeRestaurant,Menu,Follow
from restaurant.helpers import *

class MenuSerializer(serializers.ModelSerializer):
    owned = serializers.IntegerField(source='owned.id', read_only=True)
    id = serializers.ReadOnlyField()
    def create(self, validated_data):
        if not Restaurant.objects.filter(owner=self.context.get('request', None).user).exists():
            raise serializers.ValidationError("No Restaurant exist")

        return Menu.objects.create(
            owned = Restaurant.objects.filter(owner=self.context.get('request', None).user).first(),
            name = validated_data["name"],
            price = validated_data["price"],
            description = validated_data["description"],
            show_to_public = validated_data["show_to_public"],

        )

    class Meta:
        model = Menu
        fields = ['id', 'owned', 'name', 'price', 'description', 'show_to_public']


class MenuInfomationView(mixins.CreateModelMixin,
                         mixins.DestroyModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.ListModelMixin,
                         GenericViewSet):
    serializer_class = MenuSerializer
    # def get_object(self):
    #     return get_object_or_404(Restaurant, id=self.kwargs['id'])
    def get_queryset(self):
        my_restaurant = Restaurant.objects.filter(owner = self.request.user.id).first()
        return Menu.objects.filter(owned = my_restaurant).all()

    def perform_create(self, serializer):
        restaurant = Restaurant.objects.filter(owner=self.request.user).first()
        followers = [x.follow_by for x in Follow.objects.filter(follow_to = restaurant).all()]
        notify_users(followers,10,"{} update their menu".format(restaurant.name))
        serializer.save(owner=restaurant)
    def perform_update(self, serializer):
        restaurant = Restaurant.objects.filter(owner=self.request.user).first()
        followers = [x.follow_by for x in Follow.objects.filter(follow_to = restaurant).all()]
        notify_users(followers,11,"{} update their menus".format(restaurant.name))
        serializer.save()

    def perform_destroy(self, instance):
        restaurant = Restaurant.objects.filter(owner=self.request.user).first()
        followers = [x.follow_by for x in Follow.objects.filter(follow_to = restaurant).all()]
        notify_users(followers,12,"{} update their menus".format(restaurant.name))
        instance.delete()


    def list(self, request, *args, **kwargs):
        '''Returns all menus for a restuarant with restaurant_id'''
        return super().list( request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        '''Creates a menu item for a restaurant with restaurant_id'''
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        '''Deletes a menu item for a restaurant with restaurant_id'''
        return super().destroy(request, *args, **kwargs)
    def update(self, request, *args, **kwargs):
        '''Updates a menu item for a restaurant with restaurant_id'''
        return super().update(request, *args, **kwargs)


class AllMenuForARestaurantVIew(ListAPIView):
    serializer_class = MenuSerializer

    def get(self, request, *args, **kwargs):
        '''Return All menus from A restaurant(RestaurantID)'''
        return super().list( request, *args, **kwargs)



    def get_queryset(self):
        queryset = Menu.objects.filter(owned=self.kwargs['restaurant_id']).all()
        return queryset


app_name = 'restaurant'

router = routers.DefaultRouter()
router.register(r'', MenuInfomationView,basename="menu name")
urlpatterns = [
    path('', include(router.urls)),
    path('all_menu/<int:restaurant_id>/',AllMenuForARestaurantVIew.as_view(),name='AllMenuForARestaurantVIew'),
]
