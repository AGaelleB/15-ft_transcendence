from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import status, mixins, generics
from rest_framework.views import APIView
from rest_framework.response import Response
import mimetypes

from base.models import *
from base.serializers import *

##########################################################
#       USER 
##########################################################
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view

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
    individual user : retrieve (GET), update (PUT) or destroy (DELETE)
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

class ImageViewSet(APIView):
    queryset = IMG_TEST.objects.all()
    serializer_class = ImageSerializer

    def get_image_mime_type(image):
        mime_type, _ = mimetypes.guess_type(image.url)
        if mime_type is None:
            return 'application/octet-stream'
        return mime_type

    def get(self, request, pk=None):
        if pk:
            try:
                obj = IMG_TEST.objects.get(pk=pk)
                image = obj.img
            except IMG_TEST.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            # externalize MIME in a function
            mime_type, _ = mimetypes.guess_type(image.url)
            if mime_type is None:
                mime_type = 'application/octet-stream'
            return HttpResponse(image, content_type=mime_type)
        img = IMG_TEST.objects.all()
        serializer = ImageSerializer(img, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

