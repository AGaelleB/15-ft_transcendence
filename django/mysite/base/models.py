from django.db import models
from django.contrib.auth.models import AbstractUser
from .utils import rename_image

class User(AbstractUser):
    username        = models.CharField(max_length=20, blank=False, unique=True)
    avatar          = models.ImageField(upload_to=rename_image, default="default.png")
    email           = models.EmailField()
    is_connected    = models.BooleanField(default=False)
    is_2fa          = models.BooleanField(default=False)
    friends         = models.ManyToManyField("self", symmetrical=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

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



class FriendRequest(models.Model):
    date        = models.DateTimeField(auto_now_add=True, editable=False)
    sender      = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="sender")
    receiver    = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="receiver")

    def __str__(self):
        return f"id:{self.id}, from:{self.sender}, to:{self.receiver}"

    def accept_request(self):
        self.sender.friends.add(self.receiver)
        self.delete()

    def decline_request(self):
        self.delete()

    

class Game(models.Model):
    date            = models.DateTimeField(auto_now_add=True, editable=False)
    player          = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player")
    score           = models.PositiveIntegerField(default=0)
    opp_score       = models.PositiveIntegerField(default=0)

    MODE_CHOICES    = {"2d":"2d graphics", "3d":"3d graphics"}
    game_mode       = models.CharField(max_length=2, choices=MODE_CHOICES, default="2d")

    PLAYED_CHOICES  = {"1":"1 player against IA", "2":"2 players", "T":"Tournament game"}
    game_played     = models.CharField(max_length=1, choices=PLAYED_CHOICES, default="1")

    RESULT_CHOICES  = {"V":"Victory", "D":"Defeat"}
    result          = models.CharField(max_length=1, choices=RESULT_CHOICES, default="V")


    def __str__(self):
        return self.id




