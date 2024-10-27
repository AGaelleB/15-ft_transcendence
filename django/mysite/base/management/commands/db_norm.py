from django.core.management.base import BaseCommand
from django.db import connection
from base.models import User

'''
create a command (available at "python manage.py db_norm") to do some db updates, without any client interaction
'''

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if 'base_user' in connection.introspection.table_names():
            if User.objects.exists():
                User.objects.all().update(is_connected=False) #use is_active instead?

