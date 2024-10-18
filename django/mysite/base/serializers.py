from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import User, Game, IMG_TEST, FriendRequest

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

################################################################################
#                Users
################################################################################
class User_Create_Serializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'username', 'first_name', 'email', 'is_2fa']

class User_List_Serializer(serializers.ModelSerializer):
    received_invites = serializers.StringRelatedField(many=True, source="receiver", read_only=True)
    friends = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = User
        #exclude = []
        fields = ['id', 'username', 'first_name', 'email', 'is_connected', 'received_invites', 'friends']

class User_Update_Serializer(serializers.ModelSerializer):
    received_invites = serializers.StringRelatedField(many=True, source="receiver", read_only=True)
    class Meta:
        model = User
        #exclude = []
        fields = ['id', 'username', 'first_name', 'last_name',  'email', 'is_2fa', 'received_invites']


################################################################################
#               Friend invites
################################################################################
class FriendRequest_create_Serializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['sender', 'receiver']

    def validate(self, data):
        sender = data['sender']
        receiver = data['receiver']
        if sender == receiver:
            raise serializers.ValidationError("Friend invite: sender is same user as receiver")
        if FriendRequest.objects.filter(sender=sender, receiver=receiver) or FriendRequest.objects.filter(sender=receiver, receiver=sender):
            raise serializers.ValidationError("Friend invite: exists already")
        if receiver in sender.friends.all():
            raise serializers.ValidationError("Friend invite: friends already")
        # check is users are not firends already !!
        return data


class FriendRequest_show_Serializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'receiver', 'date']


################################################################################
#               Games
################################################################################
class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        exclude = []
        #fields = ['id', 'date', 'score', 'opp_score']


################################################################################
#               Images
################################################################################
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = IMG_TEST
        exclude = []
