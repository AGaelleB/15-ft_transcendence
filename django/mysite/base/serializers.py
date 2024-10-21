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

For field relationship (foreign key, manytomany etc), you can use :
    - String Related Field : display with __str__
    - Pk Related Fields : display with pk
    - Hyperlink : display API url to request the related object
    - Slug : choose one attribute
    - nested serializers: is you want several fields (cf. User.friends : id+uname),
        you may set a serializer for that field (which is actually a object on its
        own), and use it in main serializer as with the Related Field
name of the variable that handle related field MUST be name as the field
it is mainly used with read_only. if not, related ask for a queryset
many=True needed if related field can be several objects


see exactly what is does in python shell with : 
from base.serializers import UserSerializer
s = UserSerializer()
print(repr(s))
'''

################################################################################
#                Users
################################################################################
class User_Create_Serializer(serializers.ModelSerializer):
    """
    fields needed at creation
    """
    class Meta:
        model = User 
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_2fa', 'avatar']

class User_friends_Serializer(serializers.ModelSerializer):
    """
    used by other user serializers to display friends (which is a user object): .id & .username
    """
    class Meta:
        model = User
        fields = ['id', 'username']

class User_List_Serializer(serializers.ModelSerializer):
    """
    fields for the whole users list (ie list all users to select for sending a FriendRequest)
    """
    received_invites = serializers.StringRelatedField(many=True, source="receiver", read_only=True)
    friends = User_friends_Serializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email', 'is_connected', 'received_invites', 'avatar', 'friends']

class User_Update_Serializer(serializers.ModelSerializer):
    """
    fields to update a user (sensitive/personal data)
    """
    received_invites = serializers.StringRelatedField(many=True, source="receiver", read_only=True)
    friends = User_friends_Serializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name',  'email', 'is_2fa', 'avatar', 'friends', 'received_invites']

class User_Log_in_out_Serializer(serializers.ModelSerializer):
    """
    fields needed when login/logout.
    """
    class Meta:
        model = User
        fields = ['id'] # +password ?

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
