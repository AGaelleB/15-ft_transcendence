from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import status, mixins, generics
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import *
from .serializers import *
from .utils import *

##########################################################
#       USER 
##########################################################
class UserListCreate(generics.GenericAPIView, mixins.CreateModelMixin):
    """
    list all users (GET) or create a new one (POST)
    """
    queryset = User.objects.all()
    serializer_class = User_Create_Serializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return User_List_Serializer
        else:
            return User_Create_Serializer

    def get(self, request): # can use mixins.ListModelMixin.list()
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class UserRUD(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    """ 
    individual user page : retrieve (GET), update (PUT) or destroy (DELETE)
    """
    queryset = User.objects.all()
    serializer_class = User_Update_Serializer

    def get_serializer_class(self):
        if self.request.method in ['GET', 'DELETE']:
            return User_List_Serializer
        else:
            return User_Update_Serializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class User_remove_friend(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = User_List_Serializer
    
    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        friend_id = self.kwargs.get('friend')
        for f in instance.friends.all():
            if f.id == friend_id:
                instance.friends.remove(friend_id)
                return Response({"status": "Friend removed"}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "Invalid friend id."}, status=status.HTTP_400_BAD_REQUEST)

class User_log_in_out(generics.UpdateAPIView):
    """
    check pass word here (if yes, add password in serializer)?
    check if already logged to send 404 if login action?
    """
    queryset = User.objects.all()
    serializer_class = User_Log_in_out_Serializer

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
    """
    list all requests
    """
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequest_show_Serializer

class FriendRequest_retrieve(generics.RetrieveAPIView):
    """
    returns a single request
    """
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
#       GAME API VIEWS (with classbasedview cf. tuto3)
#   in urls, used as CLASS.as_view()
##########################################################
from base.models import Game
from base.serializers import GameSerializer
from django.http import Http404

from rest_framework.response import Response
from rest_framework import status

class GameList(APIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def get(self, request):
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#       GAME detail (with mixins)
class GameDetail(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def get(self, request, *args, **kwargs):
        # perform specific actions when get arrives
        return self.retrieve(request, *args, **kwargs) # calls the mixin method

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

#       GAME detail and list (rewritten with generics, uncustomizable?)
class GameListGeneric(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class GameDetailGeneric(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

##########################################################
#       Image tests
# see hasattr(p2, "restaurant")
##########################################################
from base.models import IMG_TEST
from base.serializers import ImageSerializer
import json

class ImageViewSet(generics.DestroyAPIView):
    queryset = IMG_TEST.objects.all()
    serializer_class = ImageSerializer

    def get(self, request, pk=None):
        if pk:
            try:
                obj = IMG_TEST.objects.get(pk=pk)
                image = obj.img
            except IMG_TEST.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            return HttpResponse(image, content_type=get_image_mime_type(image))
        img = IMG_TEST.objects.all()
        serializer = ImageSerializer(img, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

