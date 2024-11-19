
class User(models.Model):

    LANGUAGE_CHOICES = [
        ("fr", "French"),
        ("es", "Spanish"),
        ("en", "English"),
    ]

    username        = models.CharField(max_length=20, blank=False, unique=True)
    avatar          = models.ImageField(upload_to=rename_image, default="default.png")
    email           = models.EmailField()
    is_connected    = models.BooleanField(default=True)
    is_2fa          = models.BooleanField(default=False)
    language        = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default="en")
    friends         = models.ManyToManyField("self", symmetrical=True, blank=True)

    class Meta:
        ordering = ["id"]
        
    def delete(self, *args, **kwargs):
        """
        overide models.delete to clear friends list (no on_delete=CASCADE in many to many)
        """
        self.friends.clear()
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.username


class User_Create_Serializer(serializers.ModelSerializer):
    """
    fields needed at creation
    """
    class Meta:
        model = User
        fields  = ['id', 'username', 'email', 'is_2fa', 'avatar']

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
        fields = ['id', 'date', 'score', 'opp_score', 'player', 'game_mode', 'game_played', 'result']

class User_List_Serializer(serializers.ModelSerializer):
    """
    fields for the whole users list (ie list all users to select for sending a FriendRequest)
    """
    received_invites = serializers.StringRelatedField(many=True, source="receiver", read_only=True)
    friends = User_friends_Serializer(many=True, read_only=True)
    games = Game_easy_Serializer(many=True, source='player', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_connected', 'received_invites', 'avatar', 'friends', 'games']

class User_Update_Serializer(serializers.ModelSerializer):
    """
    fields to update a user (sensitive/personal data)
    """
    received_invites = serializers.StringRelatedField(many=True, source="receiver", read_only=True)
    friends = User_friends_Serializer(many=True, read_only=True)
    language = serializers.ChoiceField(choices=User.LANGUAGE_CHOICES)  # Ajout du champ language

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_2fa', 'avatar', 'friends', 'received_invites', 'language']  # Ajout de 'language'


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



si je vais dans http://127.0.0.1:8001/users/Gaga/ j'ai : 
HTTP 200 OK
Allow: GET, PUT, PATCH, DELETE, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "id": 1,
    "username": "Gaga",
    "email": "annegaelle.bonnefoy@gmail.com",
    "is_connected": true,
    "received_invites": [],
    "avatar": "http://127.0.0.1:8001/media/default.png",
    "friends": [],
    "games": []
}

On peut voir que je n ai pas de ligne     "language": "en"

Maintenant je fais un PUT avec language = english et j ai : 
HTTP 200 OK
Allow: GET, PUT, PATCH, DELETE, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "id": 1,
    "username": "Gaga",
    "email": "annegaelle.bonnefoy@gmail.com",
    "is_2fa": false,
    "avatar": "http://127.0.0.1:8001/media/default.png",
    "friends": [],
    "received_invites": [],
    "language": "en"
}


par contre si je refresh j ai a nouveau : 

HTTP 200 OK
Allow: GET, PUT, PATCH, DELETE, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "id": 1,
    "username": "Gaga",
    "email": "annegaelle.bonnefoy@gmail.com",
    "is_connected": true,
    "received_invites": [],
    "avatar": "http://127.0.0.1:8001/media/default.png",
    "friends": [],
    "games": []
}