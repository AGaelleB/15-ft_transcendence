from django.core.management.base import BaseCommand
from django.db import connection
from base.models import User
import os

# could not easily use the django.contrib.auth.User (or absctract) because of manager + seeting base.User as auth.user
# i would have a different type of user for admin not to have it listed with all normal users. to be solved later
class Command(BaseCommand):
    """
    create the superuser at startup with creds in .env
    """
    def handle(self, *args, **kwargs):
        admin_username = os.environ.get('DJANGO_ADMIN_USERNAME')
        admin_password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
        
        admin, created = User.objects.get_or_create(
            username=admin_username,
            defaults={
                'is_staff': True,
                'is_superuser': True,
                'email': os.environ.get('DJANGO_SUPERUSER_EMAIL')
            }
        )
        
        if created:
            admin.set_password(admin_password)
            admin.save()
            print("Super user created")