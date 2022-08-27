from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.shortcuts import get_object_or_404
from rest_framework import mixins, serializers, viewsets
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, \
    UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from restaurant.models import Restaurant,LikeRestaurant,Follow,Post,LikePost
from restaurant.helpers import *




class LikePostSerializer(serializers.ModelSerializer):
    like_post_to_id = serializers.IntegerField(write_only=True)
    like_post_to = serializers.IntegerField(read_only=True,source='like_post_to.id')
    like_post_by = serializers.IntegerField(source='like_post_by.id', read_only=True)

    class Meta:
        model = LikePost
        fields = ['id','like_post_to','like_post_by','like_post_time','like_post_to_id']

class LikePostView(mixins.CreateModelMixin,
                         mixins.DestroyModelMixin,
                         mixins.ListModelMixin,
                         GenericViewSet):
    serializer_class = LikePostSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        queryset = LikePost.objects.filter(like_post_by = self.request.user.id).all()
        return queryset

    def perform_create(self, serializer):
        to = Post.objects.filter(id=serializer.validated_data["like_post_to_id"])
        if not to.exists():
            raise serializers.ValidationError("Post does not exist")
        if LikePost.objects.filter(like_post_to = to.first(),like_post_by=self.request.user).exists():
            raise serializers.ValidationError("Already liked")
        notify_users([to.first().owned.owner],8,"{} Liked your Post  \"{}\"".format(self.request.user.get_full_name(),to.first().post_title))
        serializer.save( like_post_to = to.first(),like_post_by=self.request.user)


    def perform_destroy(self, instance):
        notify_users([instance.like_post_to.owned.owner],9,"{} Unliked your Post \"{}\"".format(self.request.user.get_full_name(),instance.like_post_to.post_title))
        instance.delete()

    def list(self, request, *args, **kwargs):
        '''Return All my liked posts'''
        return super().list( request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        '''Like the post by the postID'''
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        '''Unlike the post by the LikePostID; The LikePostID can be retrive by GET or POST'''
        return super().destroy(request, *args, **kwargs)

class LikeToPostList(ListAPIView):
    serializer_class = LikePostSerializer
    def get_queryset(self):
        to = Post.objects.filter(id = self.kwargs.get('post_id'))
        queryset = LikePost.objects.filter(like_post_to = to.first()).all()
        return queryset

    def get(self, request, *args, **kwargs):
        '''Return All users that is like A Post'''
        return super().list( request, *args, **kwargs)




app_name = 'restaurant'

router = routers.DefaultRouter()
router.register(r'mylike', LikePostView,basename="like_post")
urlpatterns = [
    path('', include(router.urls)),
    path('all_like/<int:post_id>/',LikeToPostList.as_view(),name='LikeTopost'),
]
