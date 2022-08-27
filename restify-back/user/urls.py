from django.contrib import admin
from django.urls import path, include
from user.views import RegisterView, UpdateProfile,UpdateProfile,NotificationsView,GetProfrofile
from rest_framework import routers, status
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,

)

app_name = 'user'



router2 = routers.DefaultRouter()
router2.register(r'', NotificationsView,basename="NotificationsView")

urlpatterns = [
    # Obtaining JWT token and refreshing: https://simpleisbetterthancomplex.com/tutorial/2018/12/19/how-to-use-jwt-authentication-with-django-rest-framework.html
    # Omitting refresh since it is not required and also skipping logout, since we do not store JWT tokens
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name="register"),
    path('edit/', UpdateProfile.as_view(), name="edit"),
    path('info/', GetProfrofile.as_view(), name="get_profile"),
    # path('restaurant/createpost/', CreatePostView.as_view(), name="createpost"),
    # path('restaurant/post/<int:pk_post>/', RetrievePostView.as_view(), name="viewpost"),
    # path('restaurant/editpost/<int:pk_post>/', EditPostView.as_view(), name="updatepost"),
    # path('restaurant/deletepost/<int:pk_post>/', DeletePostView.as_view(), name="deletepost"),
    path('notifications/', include(router2.urls)),
]

