from contextlib import nullcontext

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Key
from .serializers import *

@api_view(['GET'])
@permission_classes([AllowAny])
def discussions(request):
    discussions_list = Discussion.objects.all()
    serializer = DiscussionSerializer(discussions_list, many=True)
    user = request.user
    return Response(serializer.data)

@ensure_csrf_cookie
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def discussions_post(request):
    forumId = request.data.get('forum_id')
    title = request.data.get('title')
    description = request.data.get('description')
    if title is None or description is None or forumId is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    try:
        account = Account.objects.get(user__username=request.user.username)
    except Account.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    try:
        forum = Forum.objects.get(pk=forumId)
    except Forum.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


    d = Discussion(title = title, description=description,forum = forum,account= account)
    d.save()
    return Response(status=status.HTTP_201_CREATED)



@api_view(['GET', 'POST'])
def forums(request):
    if request.method == 'GET':
        forums_list = Forum.objects.all()
        serializer = ForumSerializer(forums_list, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':

        name = request.data.get('name')
        description = request.data.get('description')
        license = request.data.get('license')

        if license not in Forum.License.values:
            return Response({'error': 'License does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        repository = request.data.get('repository')
        website = request.data.get('website')

        if name is None or description is None or license is None or repository is None or website is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            account = Account.objects.get(user__username=request.user.username)
        except Account.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        f = Forum(account=account, description=description, name=name,
                  license=license, repository=repository, website=website)
        f.save()
        return Response(status=status.HTTP_201_CREATED)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def forum(request, forum_id):
    try:
        forum = Forum.objects.get(pk=forum_id)
    except Forum.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ForumSerializer(forum, many=False)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ForumSerializer(forum, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'DELETE':
        forum.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def forum_discussions(request, forum_id):
    if request.method == 'GET':
        forum = Forum.objects.get(pk=forum_id)
        discussion_list = forum.discussion_set.all()
        serializer = DiscussionSerializer(discussion_list, many=True)
        return Response(serializer.data)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def discussion(request, discussion_id):
    try:
        discussion = Discussion.objects.get(pk=discussion_id)
    except Discussion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DiscussionSerializer(discussion, many=False)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DiscussionSerializer(discussion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'DELETE':
        discussion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def discussion_comments(request, discussion_id):
    if request.method == 'GET':
        try:
            discussion = Discussion.objects.get(pk=discussion_id)
        except Discussion.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        comment_list = discussion.comment_set.all()
        serializer = CommentSerializer(comment_list, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        discussionId= request.data.get("discussion_id")
        content = request.data.get("content")
        try:
            account = Account.objects.get(user__username=request.user.username)
        except Account.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            discussion = Discussion.objects.get(pk=discussionId)
        except Discussion.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        c = Comment(content=content, discussion=discussion, account=account)
        c.save()
        return Response(status=status.HTTP_201_CREATED)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def comment(request, comment_id):
    try:
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'DELETE':
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def account(request, account_id):
    try:
        account = Account.objects.get(pk=account_id)
    except Account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AccountSerializer(account, many=False)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AccountSerializer(account, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'DELETE':
        account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def signup_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    phone = request.data.get('phone')
    developer = request.data.get('developer')

    if username is None or password is None or email is None or phone is None:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    if developer is not "":
        for key in Key.objects.all():
            if key.used is False and key.key == developer:
                user = User.objects.create_user(username=username, password=password, email=email)
                a = Account(user=user, phone=phone, developer=True)
                a.save()
                key.used = True
                key.save()
                return Response({'message': 'User [DEVELOPER] ' + user.username + ' created successfully.'},
                                status=status.HTTP_201_CREATED)
        return Response({'error': 'No such key.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    a = Account(user=user, phone=phone, developer=False)
    a.save()
    return Response({'message': 'User ' + user.username + ' created successfully.'}, status=status.HTTP_201_CREATED)

@ensure_csrf_cookie
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    serializer = UserSerializer(user)

    if user is not None:
        login(request, user)
        return Response({'message': 'Logged in successfully.', "user":serializer.data})
    else:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully.'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    try:
        account = Account.objects.get(user__username=request.user.username)
        serializer = AccountSerializer(account)
        return Response(serializer.data)
    except Account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def user_details(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@ensure_csrf_cookie
@permission_classes([AllowAny])
def get_csrf_token(request):
    return Response(status=status.HTTP_200_OK)