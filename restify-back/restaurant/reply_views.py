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
from restaurant.models import Restaurant,LikeRestaurant,Follow,Comments,Post,CommentReply


class ReplyRestaurantSerializer(serializers.ModelSerializer):
    reply_comment_to_id = serializers.IntegerField(write_only=True)
    reply_to = serializers.IntegerField(read_only=True,source='reply_to.id')
    content = serializers.CharField()

    def create(self, validated_data):
        to = Comments.objects.filter(id=validated_data["reply_comment_to_id"])
        print(validated_data["reply_comment_to_id"],to.first())
        if not to.exists():
            raise serializers.ValidationError("Comments does not exist")

        return CommentReply.objects.create(
            reply_to = to.first(),
            content = validated_data["content"]
        )
    class Meta:
        model = CommentReply
        fields = ['id','reply_to','reply_time','content','reply_comment_to_id']

class ReplyRestaurantView(mixins.CreateModelMixin,
                         mixins.DestroyModelMixin,
                         # mixins.ListModelMixin,
                         GenericViewSet):
    '''
    (POST) Creates a reply from an authenticated user to a comment on the restaurant page
    (DELETE) Deletes a reply from an authenticated user to a comment on the restaurant page
    '''
    serializer_class = ReplyRestaurantSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        my_restaurant = Restaurant.objects.filter(owner = self.request.user.id).first()
        all_comments_by_me = Comments.objects.filter(comments_to= my_restaurant).all()
        queryset = CommentReply.objects.filter(reply_to__in = all_comments_by_me ).all()
        return queryset

    def perform_create(self, serializer):
        to = CommentReply.objects.filter(reply_to = Comments.objects.filter(id = serializer.validated_data["reply_comment_to_id"]).first())
        if to.exists():
            raise serializers.ValidationError("Already reply")
        serializer.save()

class ReplyToPost(ListAPIView):
    '''
    Gets a [paginated] list of all replies associated with a comment with comments_id
    '''
    serializer_class = ReplyRestaurantSerializer
    def get_queryset(self):
        to = Comments.objects.filter(id = self.kwargs.get('comments_id'))
        queryset = CommentReply.objects.filter(reply_to = to.first()).all()
        return queryset



app_name = 'restaurant'

router = routers.DefaultRouter()
router.register(r'replys', ReplyRestaurantView,basename="replys")
urlpatterns = [
    path('', include(router.urls)),
    path('get_reply/<int:comments_id>/',ReplyToPost.as_view(),name='Replys_all'),
]
