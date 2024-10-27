from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

from .models import *

'''
How data would be sent/accepted with clients (same as django.form for pos/put)

see exactly what is does in python shell with : 
from base.serializers import UserSerializer
s = UserSerializer()
print(repr(s))

For field relationship (foreign key, manytomany etc), you can use :
    - String Related Field : display with __str__
    - Pk Related Fields : display with pk
    - Hyperlink : display API url to request the related object
    - Slug : choose one attribute
    - nested serializers: is you want several fields (cf. User.friends : id+uname),
        you may set a serializer for that field (which is actually a object on its
        own), and use it in main serializer as with the Related Field
name of the variable that handle related field MUST be named as the field
it is mainly used with read_only. if not, related ask for a queryset
many=True needed if related field can be several objects
'''

################################################################################
#                Users
################################################################################
class User_Create_Serializer(serializers.ModelSerializer):
    """
    fields needed at creation
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, validators=[validate_password])
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_2fa', 'avatar', 'password']

    def create(self, validated_data):
        # needed by abstract user
        user = User.objects.create_user(**validated_data)
        return user


class User_friends_Serializer(serializers.ModelSerializer):
    """
    used by other user serializers to display friends (which is a user object): .id & .username
    """
    class Meta:
        model = User
        fields = ['id', 'username']

class Game_easy_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'date', 'score', 'opp_score', 'player', 'opp_ia']

class User_List_Serializer(serializers.ModelSerializer):
    """
    fields for the whole users list (ie list all users to select for sending a FriendRequest)
    """
    received_invites = serializers.StringRelatedField(many=True, source="receiver", read_only=True)
    friends = User_friends_Serializer(many=True, read_only=True)
    games = Game_easy_Serializer(many=True, source='player', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_connected', 'is_active', 'received_invites', 'avatar', 'friends', 'games']

class User_Update_Serializer(serializers.ModelSerializer):
    """
    fields to update a user (sensitive/personal data)
    """
    received_invites = serializers.StringRelatedField(many=True, source="receiver", read_only=True)
    friends = User_friends_Serializer(many=True, read_only=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, validators=[validate_password])
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'is_2fa', 'avatar', 'friends', 'received_invites']

class User_Log_in_out_Serializer(serializers.ModelSerializer):
    """
    fields needed when login/logout.
    """
    class Meta:
        model = User
        fields = ['id', 'username'] # +password ?

class User_avatar_serializer(serializers.ModelSerializer):
    """
    serving the actual image
    """
    class Meta:
        model = User
        fields = ['avatar']

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
        return data


class FriendRequest_show_Serializer(serializers.ModelSerializer):
    sender = User_friends_Serializer(read_only=True)
    receiver = User_friends_Serializer(read_only=True)
    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'receiver', 'date']
        order = ['id']


################################################################################
#               Games
################################################################################
class Game_list_Serializer(serializers.ModelSerializer):
    player = User_friends_Serializer(read_only=True)
    class Meta:
        model = Game
        fields = ['id', 'date', 'score', 'opp_score', 'player', 'opp_ia']

class Game_create_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'date', 'score', 'opp_score', 'player', 'opp_ia']


