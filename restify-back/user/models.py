from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

# Create your models here.

# Code taken from https://dontrepeatyourself.org/post/django-custom-user-model-extending-abstractuser/
class CustomUserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """

        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(
                "Superuser must have is_staff=True."
            )
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(
                "Superuser must have is_superuser=True."
            )

        return self._create_user(email, password, **extra_fields)

class RestifyUser(AbstractUser):
    '''
    A model that represents a User of Restify
    '''

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=20, blank=False) # Override username field to ensure that we can omit username and avoid unique constraint from AbstractUser
    phone_number = models.CharField(max_length=10, unique=True)
    avatar = models.ImageField(null=True, blank=True, default='static/images/default_avatar.png',upload_to="static/images/")
    USERNAME_FIELD = 'email' # Makes the user log in with their email
    REQUIRED_FIELDS = ["username"]
    objects = CustomUserManager()

    def __str__(self) -> str:
        return self.email
