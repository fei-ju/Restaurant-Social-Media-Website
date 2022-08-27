# -*- coding: utf-8 -*-
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser
from user.models import RestifyUser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, \
    UpdateAPIView, DestroyAPIView
from restaurant.models import Restaurant, Post,Follow,Notification
from user.serializers import RegisterUserSerializer, RestifyUserSerializer, EditSerializer
from restaurant.serializers import PostSerializer
from rest_framework import serializers, status, mixins, viewsets
from rest_framework.viewsets import GenericViewSet
from rest_framework import serializers, status
from restaurant.helpers import *
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers, status



class RetrieveAllPost(ListAPIView):
    '''
    Gets all posts associated to the restaurant with an id of restaurant_id
    '''
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.filter(owned=Restaurant.objects.filter(id=self.kwargs['restaurant_id']).first())
        return queryset.all()



class PostViews(mixins.CreateModelMixin,
                mixins.DestroyModelMixin,
                mixins.UpdateModelMixin,
                GenericViewSet):
    '''
    (POST): Creates a new post for this user's restaurant
    (GET): Gets a post associated with id (if it exists)
    (PUT, PATCH): Updates an existing post associated with id (if it exists)
    (DELETE): Deletes a post associated with id (if it exists)
    '''
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    # def get_object(self):
    #     return get_object_or_404(Restaurant, id=self.kwargs['id'])

    def get_queryset(self):
        queryset = Post.objects.filter(owned = Restaurant.objects.filter(owner=self.request.user.id).first())
        return queryset.all()

    def perform_create(self,serializer):
        my_restaurant = Restaurant.objects.filter(owner=self.request.user)
        if not my_restaurant.exists():
            raise serializers.ValidationError("Restaurant does not exist")

        all_following = Follow.objects.filter(follow_to=my_restaurant.first()).all()
        all_followers = [x.follow_by for x in all_following]
        notify_users(all_followers,4,"{} create a new post".format(my_restaurant.first().name))

        serializer.save(owned=my_restaurant.first())

    def perform_destroy(self, instance):

        my_restaurant = instance.owned

        all_following = Follow.objects.filter(follow_to=my_restaurant).all()
        print(my_restaurant)
        print(all_following)
        all_followers = [x.follow_by for x in all_following]

        notify_users(all_followers,4,"{} deleted a post".format(my_restaurant.name))
        instance.delete()

class OnePost(mixins.RetrieveModelMixin,GenericViewSet):
    '''
    Gets a post associated with this id
    '''
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects
        return queryset.all()


app_name = 'restaurant'

router = routers.DefaultRouter()
router.register(r'', PostViews,basename="post")
router.register(r'get', OnePost,basename="postget")
urlpatterns = [
    path('restaurant/all_post/<int:restaurant_id>/', RetrieveAllPost.as_view(), name="viewallpost"),
    path('post/', include(router.urls)),
]

