from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse, FileResponse, Http404
from rest_framework import status, mixins, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

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
    """
    queryset = User.objects.filter(is_superuser=False)
    serializer_class = User_Create_Serializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return User_List_Serializer
        else:
            return User_Create_Serializer

'''    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Get token right after creation
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': User_List_Serializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''

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

class User_remove_friend(generics.UpdateAPIView):
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

class User_log_in_out(generics.UpdateAPIView):
    """
    check pass word here (if yes, add password in serializer)?
    """
    queryset = User.objects.all()
    serializer_class = User_Log_in_out_Serializer
    lookup_field = 'username'

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        action = self.kwargs.get('action')
        print(action)
        print(instance)
        if action == 'in':
            if instance.is_connected == True:
                return Response({"status": "Already logged in"}, status=status.HTTP_200_OK) # 400?
            instance.is_connected = True
            instance.save()
            return Response({"status": "Login succes"}, status=status.HTTP_200_OK)
        elif action == 'out':
            instance.is_connected = False
            instance.save()
            return Response({"status": "Logout succes"}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

class User_avatar(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = User_avatar_serializer
    lookup_field = 'username'

    def get(self, request, username=None):
        if username:
            obj = get_object_or_404(User, username=username)
            image = obj.avatar
        if not image:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return FileResponse(open(image.path, 'rb'), content_type=get_image_mime_type(image))

##########################################################
#       Friend invite
##########################################################
class FriendRequest_create(generics.CreateAPIView):
    """
    create a single Request, sender/receiver id must be provided
    """
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequest_create_Serializer

class FriendRequest_list(generics.ListAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequest_show_Serializer

class FriendRequest_retrieve(generics.RetrieveAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequest_show_Serializer
    
class FriendRequest_accept_decline(generics.RetrieveUpdateAPIView):
    """
    accept/refuse via model methods
    """
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequest_show_Serializer
    
    def put(self, request, *args, **kwargs):
        friend_request = self.get_object()
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
class GameListGeneric(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = Game_list_Serializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return Game_list_Serializer
        else:
            return Game_create_Serializer

class GameDetailGeneric(generics.RetrieveDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = Game_list_Serializer


