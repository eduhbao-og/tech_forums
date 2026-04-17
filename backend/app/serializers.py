from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Account, Forum, Discussion, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk',
                  'username',
                  'email',
        )

class AccountSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Account
        fields = ('pk',
                  'user',
                  'phone',
                  'developer'
        )

class ForumSerializer(serializers.ModelSerializer):
    account = AccountSerializer()
    class Meta:
        model = Forum
        fields = ('pk',
                  'account',
                  'route',
                  'name',
                  'description',
                  'license',
                  'repository',
                  'website'
        )

class DiscussionSerializer(serializers.ModelSerializer):
    account=AccountSerializer()

    class Meta:
        model = Discussion
        fields = ('pk',
                  'route',
                  'forum',
                  'account',
                  'title',
                  'description'
        )

class CommentSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Comment
        fields = ('pk',
                  'discussion',
                  'account',
                  'content'
        )