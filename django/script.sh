#! /bin/bash

# USE IT IN TERMINAL WITH : source script.sh

# if any python v env is already activated
deactivate > /dev/null 2>&1 && echo "venv deactivated"

# if any .venv already exists (cwd only)
rm -r .venv > /dev/null 2>&1 && echo ".venv removed"

# create the virtual env (venv = command, .venv = repo, with .venv in .gitignore)
python3 -m venv .venv && echo "venv .venv created"

# activate it (should see (.venv) at very left of prompt)
source .venv/bin/activate && echo ".venv activated"

# install requierements for django
echo "installing python packages"
python -m pip install -r requirements.txt > /dev/null && echo "python packages installed"

# set up database
#python manage.py makemigrations
#python migrate

# launch server
#python manage.py runserver
