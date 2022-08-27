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

# https://www.valentinog.com/blog/drf-request/
class RegisterView(CreateAPIView):
    '''
    Creates a new user with the given payload information.
    '''
    serializer_class = RegisterUserSerializer
    parser_classes = (MultiPartParser,)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class UpdateProfile(UpdateAPIView):
    '''
    Updates a user's profile with the given payload information.
    '''
    def get_object(self):
        return self.request.user
    permission_classes = [IsAuthenticated]
    serializer_class = EditSerializer
    parser_classes = (MultiPartParser,)

class GetProfrofile(RetrieveAPIView):
    def get_object(self):
        return self.request.user
    permission_classes = [IsAuthenticated]
    serializer_class = EditSerializer

class NotificationsViewSerializer(serializers.ModelSerializer):

    notification_to = serializers.IntegerField(source='notification_to.id', read_only=True)

    class Meta:
        model = Notification
        fields = ('id','type', 'content', 'notification_to')

class NotificationsView(mixins.ListModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    '''
    (GET) Gets all notifications for this user
    (DELETE) Deletes all notifications for this user
    '''

    serializer_class = NotificationsViewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Notification.objects.filter(notification_to=self.request.user.id)
        return queryset.all()

