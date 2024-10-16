import uuid
from django.db import models

class User(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username        = models.CharField(max_length=20, blank=False)
    first_name      = models.CharField(max_length=30, blank=False)
    last_name       = models.CharField(max_length=30, blank=False)
    #avatar          = models.ImageField()
    email           = models.EmailField()
    is_connected    = models.BooleanField(default=False)
    is_2fa          = models.BooleanField(default=False)
    #friends         = models.ManyToManyField("self")

    # optional
    #birth_date      = models.DateTimeField()
    #last_login      = models.DateTimeField()
    #account_create  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

    class Meta:
        ordering = ["username"]


class Tournament(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=25, null=False)
    date = models.DateTimeField()
    nb_player = models.IntegerField(null=False)
    
    def __str__(self):
        return self.uid
    
class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateTimeField(auto_now_add=True, editable=False)
    #player1 = models.ForeignKey(User, on_delete=models.PROTECT, related_name="player")
    score = models.PositiveIntegerField()
    opp_score = models.PositiveIntegerField(default='0')
    #tournament = models.ForeignKey(Tournament, on_delete=models.PROTECT)

    def __str__(self):
        return self.uid

class IMG_TEST(models.Model):
    name = models.CharField(max_length=25)
    img = models.ImageField(upload_to='images')

    def __str__(self):
        return self.name


