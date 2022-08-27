from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import mixins, serializers, viewsets
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, \
    UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from restaurant.models import Restaurant,LikeRestaurant,Follow,Comments,Post
from restaurant.helpers import *

class CommentsRestaurantSerializer(serializers.ModelSerializer):
    comment_restaurant_to_id = serializers.IntegerField(write_only=True)
    comments_to = serializers.IntegerField(read_only=True,source='comments_to.id')
    comments_by = serializers.IntegerField(source='comments_by.id', read_only=True)
    def create(self, validated_data):
        to = Restaurant.objects.filter(id=validated_data["comment_restaurant_to_id"])
        if not to.exists():
            raise serializers.ValidationError("Restaurant does not exist")

        return Comments.objects.create(
            comments_to = to.first(),
            comments_by =self.context.get('request', None).user,
            content = validated_data["content"]
        )

    class Meta:
        model = Comments
        fields = ['id','comments_by','comments_to','comments_time','content','comment_restaurant_to_id']

class CommentsRestaurantView(mixins.CreateModelMixin,
                         mixins.DestroyModelMixin,
                         GenericViewSet):
    serializer_class = CommentsRestaurantSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        queryset = Comments.objects.filter(comments_by = self.request.user.id).all()
        return queryset

    def perform_create(self, serializer):
        to = Restaurant.objects.filter(id=serializer.validated_data["comment_restaurant_to_id"])
        if not to.exists():
            raise serializers.ValidationError("Restaurant does not exist")

        notify_users([to.first().owner],6,"{} wrote a new comment to your restaurant".format(self.request.user.get_full_name()))
        serializer.save( )


    def perform_destroy(self, instance):
        to = instance.comments_to.owner
        notify_users([to],7,"{} delete a new comment to your restaurant".format(self.request.user.get_full_name()))
        instance.delete()


    def create(self, request, *args, **kwargs):
        '''Like the restaurant by the restaurantID'''
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        '''Unlike the restaurant by the LikeID; The LikeID can be retrive by GET or POST'''
        return super().destroy(request, *args, **kwargs)

class CommentsListView(ListAPIView):
    serializer_class = CommentsRestaurantSerializer
    def get_queryset(self):
        queryset = Comments.objects.filter(comments_to = self.kwargs['restaurant_id']).all()
        return queryset

    def list(self, request, *args, **kwargs):
        '''Return All Comments to restaurant'''
        return super().list( request, *args, **kwargs)


app_name = 'restaurant'

router = routers.DefaultRouter()
router.register(r'comments', CommentsRestaurantView,basename="comments")
urlpatterns = [
    path('', include(router.urls)),
    path('all_comments/<int:restaurant_id>/',CommentsListView.as_view(),name='AllCommentsToRestaurant2'),
]

