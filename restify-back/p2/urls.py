"""p2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path

from django.conf.urls.static import static
from django.conf import settings

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/',include('user.urls',namespace='user')),
    path('restaurant_general/',include('restaurant.informations_views',namespace='restaurant_general')),
    path('restaurant_like/',include('restaurant.like_views',namespace='restaurant like')),
    path('restaurant_follow/',include('restaurant.follow_views',namespace='restaurant follow')),
    path('restaurant_menu/',include('restaurant.menu_views',namespace='restaurant menus')),
    path('restaurant_reply/',include('restaurant.reply_views',namespace='Comments reply')),
    path('post_like/',include('restaurant.like_post_views',namespace='like post')),
    path('post_comments/',include('restaurant.comment_views',namespace='post comments')),
    path('post_actions/',include('restaurant.post_view',namespace='posts')),

    path('restaurant_picture/',include('restaurant.picture_views',namespace='restaurant picture')),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    ]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
