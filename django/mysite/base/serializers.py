from rest_framework import serializers
from .models import User, Game, IMG_TEST

'''
How data would be sent/accepted with clients (same as django.form for pos/put)
note: class fields may be "overriden" by the serializer :
    - you may create a new instance while not respecting class (ie. class field
        not included in seria fields, even though its required)
    - use fields = [] to include, 
    - exclude [] -> use all model fields ()
Is it needed to create several serializers for different action?
    --> absolutely possible, cf. end of tuto 3 with APIview + mixins/generics

see exactly what is does in python shell with : 
from base.serializers import UserSerializer
s = UserSerializer()
print(repr(s))
'''

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = []
        #fields = ['id', 'username', 'first_name', 'email', 'is_connected']

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        exclude = []
        #fields = ['id', 'date', 'score', 'opp_score']

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = IMG_TEST
        exclude = []
