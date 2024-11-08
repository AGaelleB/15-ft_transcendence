from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.http import HttpResponse, JsonResponse, FileResponse, Http404
from rest_framework import status, mixins, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from jwtauth import login, logout
from django.contrib.auth import authenticate

from .models import *
from .serializers import *
from .utils import *
from .permissions import *


##########################################################
#       USER 
##########################################################
class UserListCreate(generics.ListCreateAPIView):
    """
    list all users, except superuser (GET) or create a new one (POST)
    no JWT returned on creation: you must then login
    """
    permission_classes      =   [UserListCreatePermission]
    queryset                =   User.objects.filter(is_superuser=False)
    serializer_class        =   User_Create_Serializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return User_List_Serializer
        else:
            return User_Create_Serializer


class UserListConnected(generics.ListAPIView):
    permission_classes      =   [IsUserConnectedPermission]
    queryset                =   User.objects.filter(is_superuser=False, is_connected=True)
    serializer_class        =   User_friends_Serializer


class UserRUD(generics.RetrieveUpdateDestroyAPIView):
    """ 
    individual user page : retrieve (GET), partial_update (PUT) or destroy (DELETE)
    """
    permission_classes      =   [UserRUDPermission]
    queryset                =   User.objects.all()
    serializer_class        =   User_Update_Serializer
    lookup_field            =   'username'

    def get_serializer_class(self):
        if self.request.method in ['GET', 'DELETE']:
            return User_List_Serializer
        else:
            return User_Update_Serializer
    
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        logout(request)
        return self.destroy(request, *args, **kwargs)


class User_avatar(generics.RetrieveAPIView):
    permission_classes      =   [IsUserConnectedPermission]
    queryset                =   User.objects.all()
    lookup_field            =   'username'

    def get(self, request, username=None):
        if username:
            obj = get_object_or_404(User, username=username)
            image = obj.avatar
        if not image:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return FileResponse(open(image.path, 'rb'), content_type=get_image_mime_type(image))


class User_remove_friend(generics.UpdateAPIView):
    permission_classes      =   [UserRUDPermission]
    queryset                =   User.objects.all()
    serializer_class        =   User_List_Serializer
    lookup_field            =   'username'
    
    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        friend_username = self.kwargs.get('friend')
        try:
            friend_id = User.objects.get(username=friend_username).id
        except User.DoesNotExist:
            return Response({"status": "Unknown friend user"}, status=status.HTTP_400_BAD_REQUEST)
        for f in instance.friends.all():
            if f.id == friend_id:
                instance.friends.remove(friend_id)
                return Response({"status": "Friend removed"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"status": "Invalid friend id."}, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    """
    see serializer: if request.user.is_authenticated: logout user, then login(username, password)
    2FA later: maybe also via serializer? if not we can redefine here the post method
    """
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if request.user.is_authenticated:
            return Response({"status": "A user is already connected, please logout first"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=serializer.validated_data['username'], password=serializer.validated_data['password'])
        if user is None:
            return Response({"status": "Wrong password"}, status=status.HTTP_400_BAD_REQUEST)
        # 2fa here
        user.is_connected = True
        user.save()
        login(request, user)
        return Response({"status": "login succes"}, status=status.HTTP_202_ACCEPTED)



class UserLogout(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated == False:
            return Response({"status": "unauthenticated user"}, status=status.HTTP_400_BAD_REQUEST)
        if request.user.is_connected == False:
            return Response({"status": "user not connected"}, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.is_connected = False
        request.user.save()
        logout(request)
        return Response({"status": "log out success"}, status=status.HTTP_204_NO_CONTENT)


class ResetPassword(generics.GenericAPIView):
    """
    since generics.view, do we need to specify serializer in post? try
    old != new done in seria
    """
    permission_classes      =   [IsUserConnectedPermission]
    serializer_class        =   ResetPasswordSerializer

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if user.check_password(serializer.validated_data['old_password']) == False:
            return Response({"status": "wrong password"}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"status": "password has been reset"}, status=status.HTTP_201_CREATED)


##########################################################
#       Friend invite
##########################################################
class FriendRequest_create(generics.CreateAPIView):
    """
    create a single Request, sender/receiver id must be provided, auth user must be sender
    """
    permission_classes      =   [FriendRequestCreatePermission]
    queryset                =   FriendRequest.objects.all()
    serializer_class        =   FriendRequest_create_Serializer


class FriendRequest_list(generics.ListAPIView):
    permission_classes      =   [IsUserConnectedPermission]
    queryset                =   FriendRequest.objects.all()
    serializer_class        =   FriendRequest_show_Serializer


class FriendRequest_retrieve(generics.RetrieveAPIView):
    permission_classes      =   [IsUserConnectedPermission]
    queryset                =   FriendRequest.objects.all()
    serializer_class        =   FriendRequest_show_Serializer


class FriendRequest_accept_decline(generics.UpdateAPIView):
    """
    accept/refuse via model methods, auth.user must be revceiver
    cant use permission to detect if request.user is receiver.id (cant get pk in permissions)
    """
    queryset                =   FriendRequest.objects.all()
    serializer_class        =   FriendRequest_show_Serializer

    def put(self, request, *args, **kwargs):
        friend_request = self.get_object()
        if str(friend_request.receiver.id) != str(request.user.id):
            return Response({"status": "Only receiver can accept/decline friend request"}, status=status.HTTP_401_UNAUTHORIZED)
        action = self.kwargs.get('action')
        if action == "accept":
            friend_request.accept_request()
            return Response({"status": "Friend request accepted."}, status=status.HTTP_200_OK)
        elif action == "decline":
            friend_request.decline_request()
            return Response({"status": "Friend request declined."}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)


##########################################################
#       GAME API VIEWS 
##########################################################
class GameListCreate(generics.ListCreateAPIView):
    #permission_classes      =   [GameListCreatePermission] not tested yet, might be on error 
    queryset                =   Game.objects.all()
    serializer_class        =   Game_list_Serializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return Game_list_Serializer
        else:
            return Game_create_Serializer


class GameRetrieve(generics.RetrieveAPIView):
    permission_classes      =   [IsUserConnectedPermission]
    queryset                =   Game.objects.all()
    serializer_class        =   Game_list_Serializer


