#! /bin/bash
#
python manage.py makemigrations
python manage.py migrate
python manage.py db_norm
python manage.py runserver 0.0.0.0:8001

