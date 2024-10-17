from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
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
from base.serializers import UserSerializer

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
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = UserSerializer(user, data=data, partial=True)
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
from base.models import Game
from base.serializers import GameSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class GameList(APIView):
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
from rest_framework import mixins
from rest_framework import generics

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
##########################################################
from base.models import IMG_TEST
from base.serializers import ImageSerializer
import json

class ImageViewSet(APIView):
    queryset = IMG_TEST.objects.all()
    serializer_class = ImageSerializer

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

@api_view(['GET'])
def image_view(request, pk):
    '''
    integrated in ImageViewSet get
    '''
    try:
        obj = IMG_TEST.objects.get(pk=pk)
    except IMG_TEST.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    image = obj.img
    return HttpResponse(image, content_type="image/png")
