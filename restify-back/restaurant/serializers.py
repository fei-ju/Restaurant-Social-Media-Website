from rest_framework import serializers

from restaurant.models import Post


class PostSerializer(serializers.ModelSerializer):
    owned = serializers.IntegerField(source='owned.id', read_only=True)
    class Meta:
        model = Post
        fields = [
            'id',
            'owned',
            'post_date',
            'post_content',
            'post_title',
            'show_to_public',
        ]
