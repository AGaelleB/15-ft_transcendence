from django.db import models

class User(models.Model):
    username        = models.CharField(max_length=20, primary_key=True)
    #tournament_name = models.CharField(max_length=20, unique=True, blank=False)
    first_name      = models.CharField(max_length=30, null=False, blank=False)
    last_name       = models.CharField(max_length=30, null=False, blank=False)
    #avatar          = models.ImageField()
    email           = models.EmailField()
    is_connected    = models.BooleanField(default=False)
    is_2fa          = models.BooleanField(default=False)
    #friends         = models.ManyToManyField("self")

    # optional
    #birth_date      = models.DateTimeField()
    #last_login      = models.DateTimeField()
    #account_create  = models.DateTimeField()

    def __str__(self):
        return self.username

    def create(self, username, first_name, last_name, email):
        self.create(username=username, first_name=first_name, last_name=last_name, email=email, is_2fa=False)

    def log_in(self):
        self.is_connected = True

    def log_out(self):
        self.is_connected = False

class Tournament(models.Model):
    uid = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=25, null=False)
    date = models.DateTimeField()
    nb_player = models.IntegerField(null=False)
    
    def __str__(self):
        return self.uid
    
class Game(models.Model):
    uid = models.IntegerField(primary_key=True)
    date = models.DateTimeField()
    player1 = models.ForeignKey(User, on_delete=models.PROTECT, related_name="player1")
    score_player1 = models.IntegerField()
    player2 = models.ForeignKey(User, on_delete=models.PROTECT, related_name="player2")
    score_player1 = models.IntegerField()
    tournament = models.ForeignKey(Tournament, on_delete=models.PROTECT)
    def __str__(self):
        return self.uid
