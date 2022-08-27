from user.models import RestifyUser
from django.db import models
from django.db.models import CASCADE
from django.db.models import SET_NULL

class Restaurant(models.Model):
    '''
    name: name of the restaurant.
    address: address of the restaurant.
    logo: logo of the restaurant.
    postal_code: postal_code of the restaurant, associate with the address.
    phone: phone number of the restaurant, canadian numbers only.
    owner: owner of the restaurant, one user only have one restaurant.
    '''
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=500)
    postal_code = models.CharField(max_length=10)
    phone = models.IntegerField()
    owner = models.OneToOneField(RestifyUser, related_name='owner',on_delete=CASCADE)
    logo = models.ImageField(null=True, blank=True, default='static/images/default_logo.png',upload_to="static/images/")

class Post(models.Model):
    '''
    owned: the owner restaurant of this post.
    post_date: the post publish date.
    post_content: the post content.
    post_title: the post title.
    show_to_public: the public status of the post.
    '''
    owned = models.ForeignKey(to=Restaurant,related_name='owned',on_delete=CASCADE)
    post_date = models.DateTimeField(auto_now_add=True)
    post_content = models.TextField()
    post_title = models.CharField(max_length=100)
    show_to_public = models.BooleanField(default=True)

class Menu(models.Model):
    '''
    owned: the owner restaurant of this menu.
    name: the item's name.
    price: the item's price.
    description: the item's description.
    show_to_public: the public status of the menu.

    '''
    owned = models.ForeignKey(to=Restaurant,related_name='menu_owned',on_delete=CASCADE)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField()
    show_to_public = models.BooleanField(default=True)


class Comments(models.Model):
    '''
    This model is use when user comments on post.
    content: content inside the comments.
    comments_by: the comments user.
    comments_to: which post is comments on.
    '''
    content = models.TextField()
    comments_by = models.ForeignKey(to=RestifyUser,related_name='comments_by',on_delete=CASCADE)
    comments_to = models.ForeignKey(to=Restaurant,related_name='comments_to',on_delete=CASCADE)
    comments_time = models.DateTimeField(auto_now_add=True)

class CommentReply(models.Model):
    '''
    This model is use when restaurant owner reply to comments.
    content: content of reply.
    reply_to: which comments is reply to.
    '''
    content = models.TextField()
    reply_to = models.OneToOneField(to=Comments,related_name='reply_to',on_delete=CASCADE)
    reply_time = models.DateTimeField(auto_now_add=True)

class LikePost(models.Model):
    '''
    This model is use when a user like a post.
    like_post_to: the post that the user like.
    like_post_by: the user that liked the post.
    like_post_time: when did the user liked this post.
    '''
    like_post_to = models.ForeignKey(to=Post,related_name='like_post_to',on_delete=CASCADE)
    like_post_by = models.ForeignKey(to=RestifyUser,related_name='like_post_by',on_delete=CASCADE)
    like_post_time = models.DateTimeField(auto_now_add=True)

class LikeRestaurant(models.Model):
    '''
    This model is use when user like a restaurant.
    like_restaurant_to: which restaurant is the user like to.
    like_restaurant_by: which user is like the restaurant.
    like_restaurant_time: when did the user liked the restaurant.
    '''
    like_restaurant_to = models.ForeignKey(to=Restaurant,related_name='like_restaurant_to',on_delete=CASCADE)
    like_restaurant_by = models.ForeignKey(to=RestifyUser,related_name='like_restaurant_by',on_delete=CASCADE)
    like_restaurant_time = models.DateTimeField(auto_now_add=True)

class Follow(models.Model):
    '''
    This model is use when user follow a restaurant.
    follow_to: which restaurant is the user following.
    follow_by: The user that followed the restaurant.
    follow_time: The time of following.
    '''
    follow_to = models.ForeignKey(to=Restaurant,related_name='follow_to',on_delete=CASCADE)
    follow_by = models.ForeignKey(to=RestifyUser,related_name='follow_by',on_delete=CASCADE)
    follow_time = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    '''
    This model is use when we need to generate notifications for user, this need
    to be handled by the program, e.g. when a new post publish, generate
    n notifications for n users that are following.
    type: The type of the notification.
    content: The content of the notification.
    notification_to: The user that should be notified.
    '''
    type = models.IntegerField()
    content = models.CharField(max_length=200)
    notification_to = models.ForeignKey(to=RestifyUser,related_name='notification_to',on_delete=CASCADE)

class PictureModel(models.Model):
    '''
    This model is use when we need to create or delete pictures for the restaurant.
    owned: The owner restaurant of this picture
    picture: The picture to be added to restaurant
    '''
    rest_owner = models.ForeignKey(to=Restaurant,related_name='rest_owner',on_delete=CASCADE)
    restaurant_picture = models.ImageField(null=True, blank=True, default='static/images/qq.png',upload_to="static/images/")
    #show_to_public = models.BooleanField(default=True)
