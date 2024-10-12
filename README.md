# MODULES

## branch bastien:   
django server to launch the front end  
### 12/05/2024 21:30 State:  
* index.html served with static (except languages)
* user_form.html: form data to server via a websocket, input validity and explicit succes/failure
* structure.txt: how to implement the classes/db ; some rules to choose  
### How to use:
in django repo, use `source script.sh` : create a virtual env and get python packages  
```cd mysite``` : (repo with a file manage.py)  
```python manage.py makemigrations``` : update migrations  
```python manage.py migrate``` : migrate (create/update db)  
```python manage.py runserver``` : launch server  
open a browser on 127.0.0.1:8000/ --> index page de pong (+ 2 liens http vers user_form.html and user_listing.html)  

## Web
[] Major module: Use a Framework as backend.
[X] Minor module: Use a front-end framework or toolkit.
[] Minor module: Use a database for the backend -and more.

## User Management
[] Major module: Standard user management, authentication, users across tournaments


## Gameplay and user experience
[X] Minor module: Game Customization Options.

## AI-Algo
[X] Major module: Introduce an AI Opponent
[] Minor module: User and Game Stats Dashboards.

## Cybersecurity
[] Major module: Implement Two-Factor Authentication (2FA) and JWT.

## Graphics
[en cours] Major module: Implementing Advanced 3D Techniques

## Accessibility
[] Minor module: Expanding Browser Compatibility.
[X] Minor module: Multiple language supports.
[] Minor module: Add accessibility for Visually Impaired Users


# AUTRES

## Générer un nouveau projet Django

Pour que Django génère automatiquement le fichier manage.py, exécuter la commande suivante dans le répertoire django/ pour initialiser correctement le projet :

``` bash
django-admin startproject mybackend .
```




