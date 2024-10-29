from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse, FileResponse, Http404
from rest_framework import status, mixins, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView


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
    authentication_classes = [JWTAuthentication]
    permission_classes = [UserListCreatePermission]
    queryset = User.objects.filter(is_superuser=False)
    serializer_class = User_Create_Serializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return User_List_Serializer
        else:
            return User_Create_Serializer

class UserRUD(generics.RetrieveUpdateDestroyAPIView):
    """ 
    individual user page : retrieve (GET), partial_update (PUT) or destroy (DELETE)
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [UserRUDPermission]
    queryset = User.objects.all()
    serializer_class = User_Update_Serializer
    lookup_field = 'username'

    def get_serializer_class(self):
        if self.request.method in ['GET', 'DELETE']:
            return User_List_Serializer
        else:
            return User_Update_Serializer
    
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class User_avatar(generics.RetrieveAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsUserConnectedPermission]
    queryset = User.objects.all()
    lookup_field = 'username'

    def get(self, request, username=None):
        if username:
            obj = get_object_or_404(User, username=username)
            image = obj.avatar
        if not image:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return FileResponse(open(image.path, 'rb'), content_type=get_image_mime_type(image))

class User_remove_friend(generics.UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [UserRUDPermission]
    queryset = User.objects.all()
    serializer_class = User_List_Serializer
    lookup_field = 'username'
    
    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        friend_username = self.kwargs.get('friend')
        friend_id = User.objects.get(username=friend_username).id
        for f in instance.friends.all():
            if f.id == friend_id:
                instance.friends.remove(friend_id)
                return Response({"status": "Friend removed"}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "Invalid friend id."}, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(TokenObtainPairView):
    """
    redifining simple-JWT view to integrate: user.is_connected=True via the serializer
    2FA later: maybe also via serializer? if not we can redefine here the post method
    source code: https://github.com/jazzband/djangorestframework-simplejwt/blob/master/rest_framework_simplejwt/views.py
    """
    serializer_class = UserLoginSerializer

class UserLogout(APIView):
    """
    using APIView to manually get the refresh in body (generics wont check it)
    not sure i need to try/cacth the refresh.blacklist bc token presence and validity checked in seria
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [UserLogoutPermission]
    def post(self, request):
        serializer = UserLogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        refresh = RefreshToken(serializer.validated_data['refresh'])
        try:
            refresh.blacklist()
            user.is_connected = False
            user.save()
            return Response({"status": "Logout succes, refresh token blacklisted"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"status": f"Error blacklisting tokens: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


##########################################################
#       Friend invite
##########################################################
class FriendRequest_create(generics.CreateAPIView):
    """
    create a single Request, sender/receiver id must be provided, auth user must be sender
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [FriendRequestCreatePermission]
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequest_create_Serializer

class FriendRequest_list(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsUserConnectedPermission]
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequest_show_Serializer

class FriendRequest_retrieve(generics.RetrieveAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsUserConnectedPermission]
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequest_show_Serializer
    
class FriendRequest_accept_decline(generics.UpdateAPIView):
    """
    accept/refuse via model methods, auth.user must be revceiver
    cant use permission to detect if request.user is receiver.id (cant get pk in permissions)
    """
    authentication_classes = [JWTAuthentication]
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequest_show_Serializer
    
    def put(self, request, *args, **kwargs):
        friend_request = self.get_object()
        print(friend_request.receiver.id)
        print(request.user.id)
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
    queryset = Game.objects.all()
    serializer_class = Game_list_Serializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return Game_list_Serializer
        else:
            return Game_create_Serializer

class GameRetrieve(generics.RetrieveDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = Game_list_Serializer


