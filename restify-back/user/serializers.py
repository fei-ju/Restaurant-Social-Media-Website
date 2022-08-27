from rest_framework import serializers
from rest_framework.generics import UpdateAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
import django.contrib.auth.password_validation as validators

from user.models import RestifyUser


class RestifyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model =  RestifyUser
        fields = [
            'first_name',
            'last_name',
            'email',
            'avatar',
            'phone_number',
        ]


class RegisterUserSerializer(serializers.ModelSerializer):

    # Password was originally not being hashed to db, fix taken from https://stackoverflow.com/questions/55906891/django-drf-simple-jwt-authenticationdetail-no-active-account-found-with-the

    avatar = serializers.ImageField(required=False)

    def validate_password(self, value: str) -> str:
        """
        Hash value passed by user.

        :param value: password of a user
        :return: a hashed version of the password
        """
        return make_password(value)

    class Meta:
        model = RestifyUser
        fields = [
            'first_name',
            'last_name',
            'email',
            'password',
            'phone_number',
            'avatar'
        ]

class EditSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    email = serializers.CharField(required=False)
    phone_number = serializers.CharField(required=False)
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = RestifyUser
        fields = ('first_name', 'last_name', 'email', 'phone_number', 'avatar')


