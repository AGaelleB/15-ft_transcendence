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
    date = models.DateTimeField(auto_now_add=True, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="receiver")

    def __str__(self):
        return f"id:{self.id}, from:{self.sender}, to:{self.receiver}"

    def accept_request(self):
        self.sender.friends.add(self.receiver)
        self.delete()

    def decline_request(self):
        self.delete()


class Tournament(models.Model):
    name = models.CharField(max_length=25, null=False)
    date = models.DateTimeField()
    nb_player = models.IntegerField(null=False)
    
    def __str__(self):
        return self.id
    
class Game(models.Model):
    date = models.DateTimeField(auto_now_add=True, editable=False)
    player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player")
    score = models.PositiveIntegerField()
    opp_score = models.PositiveIntegerField()
    opp_ia = models.BooleanField(default=True)

    def __str__(self):
        return self.id




