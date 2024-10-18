from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
import mimetypes

def index(request):
    return render(request, "base/index.html")

def user_form(request):
    return render(request, "base/user_form.html")

def user_info(request):
    return render(request, "base/user_info.html")

def user_connected(request):
    return render(request, "base/user_connected.html")

''' 
second arg "path" needed because re_path (cf. urls.py) returns the match pattern (against the given regex)
it permits to adapt the views code depending on the real pattern matched
not needed for path() bc it matchs a fixed pattern
'''
def user_listing(request, path=None):
    return render(request, "base/user_listing.html")


##########################################################
#       USER API VIEWS (with decorators cf. tuto2)
##########################################################
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from base.models import User
from base.serializers import *

'''
#@csrf_exempt
@api_view(['GET', 'POST'])
def user_list(request):
    """
    List all users, or create a new user.
    """
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''

class UserList(APIView):
    queryset = User.objects.all()
    serializer_class = User_Create_Serializer

    def get(self, request):
        users = User.objects.all()
        serializer = User_List_Serializer(self.get_q, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = User_Create_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    """
    Retrieve, update or delete a user.
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = User_List_Serializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = User_Update_Serializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


##########################################################
#       GAME API VIEWS (with classbasedview cf. tuto3)
#   in urls, used as CLASS.as_view()
##########################################################
from .models import Friend_invite
from .serializers import Friend_invite_create_Serializer, Friend_invite_show_Serializer
from rest_framework import mixins
from rest_framework import generics

class friend_invite_create(generics.CreateAPIView):
    queryset = Friend_invite.objects.all()
    serializer_class = Friend_invite_create_Serializer

# do i need to define get to list or retrieve (cf. img_test) or not? --> no
class friend_invite_list_retrieve(generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Friend_invite.objects.all()
    serializer_class = Friend_invite_show_Serializer

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

