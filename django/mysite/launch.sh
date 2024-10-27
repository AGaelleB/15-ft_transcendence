#! /bin/bash

# secret_key rotating
export SECRET_KEY=$(cat /dev/urandom | tr -dc '0-9a-zA-Z!@#$%^&*_+-' | head -c 132)
echo "SECRET_KEY=$SECRET_KEY" >> .env

python manage.py makemigrations
python manage.py migrate
python manage.py db_norm 
# db_norm to change is_active + superuser commands for creating user/games
python manage.py runserver 0.0.0.0:8001
