# -*- coding: utf-8 -*-
from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import mixins, routers, serializers, viewsets
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, \
    UpdateAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from restaurant.models import Restaurant,LikeRestaurant,Menu,Follow,Post,Comments


class RestaurantSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source='owner.get_full_name', read_only=True)
    id = serializers.ReadOnlyField()
    like_count = serializers.SerializerMethodField()
    follower_count = serializers.SerializerMethodField()
    post_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    logo = serializers.ImageField(required=False)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'address', 'logo', 'postal_code', 'phone', 'owner','like_count','follower_count','post_count','comment_count']
    def get_like_count(self, obj):
        return LikeRestaurant.objects.filter(like_restaurant_to = obj).count()
    def get_follower_count(self,obj):
        return Follow.objects.filter(follow_to = obj).count()
    def get_post_count(self,obj):
        return Post.objects.filter(owned = obj).count()
    def get_comment_count(self,obj):
        return Comments.objects.filter(comments_to = obj).count()

class MyRestaurant(ListAPIView):
    '''
    Return my restaurant
    '''
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Restaurant.objects.filter(owner = self.request.user).all()
    def list(self, request, *args, **kwargs):
        return super().list( request, *args, **kwargs)

class GetOneRestaurantInformation(RetrieveAPIView):
    '''
    Return one restaurant information
    '''
    serializer_class = RestaurantSerializer
    def get_queryset(self):
        return Restaurant.objects.all()
    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, id=self.kwargs['pk'])
        return obj

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve( request, *args, **kwargs)

class RestaurantInfomationView(viewsets.ModelViewSet):
    serializer_class = RestaurantSerializer
    queryset = Restaurant.objects.all()
    # def get_object(self):
    #     return get_object_or_404(Restaurant, id=self.kwargs['id'])
    parser_classes = (MultiPartParser,)
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Restaurant.objects.filter(owner = self.request.user.id).all()

    def perform_create(self, serializer):
        print(self.request.user)

        if Restaurant.objects.filter(owner=self.request.user.id).exists():
            raise serializers.ValidationError("Restaurant exist")
        serializer.save(owner=self.request.user)

    def list(self, request, *args, **kwargs):
        '''Return all the restaurants'''
        return super().list( request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        '''Return information for one restaurant'''
        return super().retrieve(self, request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        '''Create restaurant'''
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        '''Delete the restaurant'''
        return super().destroy(request, *args, **kwargs)
    def update(self, request, *args, **kwargs):
        '''Update the restaurant's info'''
        return  super().update( request, *args, **kwargs)

q_param = openapi.Parameter( 'q', in_=openapi.IN_QUERY, description='Query String', type=openapi.TYPE_STRING, )
class SearchRestaurant2(ListAPIView):
    serializer_class = RestaurantSerializer
    # queryset = Restaurant.objects.all()

    @swagger_auto_schema( manual_parameters=[q_param], )
    def get(self, request, *args, **kwargs):
        '''Search the restaurant by restaurant Name, Address, Menus'''
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        result_lst = []
        q = self.request.GET.get("q","")
        raw = {}
        for restaurant in Restaurant.objects.all():
            raw[restaurant.id] = restaurant

        f_rank = Follow.objects.all().values('follow_to').annotate(total=Count('follow_to')).order_by('total')
        all = []
        for item in f_rank:
            all.append(raw[item["follow_to"]])
        for item in raw:
            if raw[item] not in all:
                all.append(raw[item])
        if q == "":
            result_lst.extend(all)
        else:
            for rest in all:
                if q in rest.name:
                    result_lst.append(rest)
                    continue
                if q in rest.address:
                    result_lst.append(rest)
                    continue
                for item in Menu.objects.filter(owned = rest).all():
                    if q in item.name :
                        result_lst.append(rest)
                        break
        return result_lst

class postSerializer(serializers.ModelSerializer):
    owned = serializers.IntegerField(source='owned.id', read_only=True)

    class Meta:
        model = Post

        fields = ['id','owned','post_date','post_content','post_title']

class feedSerializer(ListAPIView):
    serializer_class = postSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        all_following = Follow.objects.filter(follow_by=self.request.user.id).all()
        all_following_restaurant = [x.follow_to for x in all_following]
        return Post.objects.filter(owned__in=all_following_restaurant).order_by('id').all()
    def get(self, request, *args, **kwargs):
        '''This will return all the post from restaurant that you are following'''
        return self.list(request, *args, **kwargs)


app_name = 'restaurant'

router = routers.DefaultRouter()
router.register(r'information', RestaurantInfomationView)
urlpatterns = [
    path('', include(router.urls)),
    path('search/',SearchRestaurant2.as_view(),name='SearchRestaurant'),
    path('feed/',feedSerializer.as_view(),name='Feed'),
    path('my_restaurant/',MyRestaurant.as_view(),name='my_restaurant'),
    path('restaurant_info/<int:pk>/',GetOneRestaurantInformation.as_view(),name='restaurant_info'),
]
