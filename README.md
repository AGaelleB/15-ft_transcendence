# MODULES

## branch bastien:   
### How to launch:
in django repo, use `source script.sh` : create a virtual env and get python packages  
```cd mysite``` : (repo with a file manage.py)  
```python manage.py makemigrations``` : update migrations  
```python manage.py migrate``` : migrate (create/update db)  
```python manage.py runserver``` : launch server  

### API use :
* available on 127.0.0.1:8000/  
* routes : users/ (get all user or create new one) and users/uid/ (detail, update, delete)
* same routes with games for class Game 
* images available at upload/
* trailing '/' mandatory ("127.0.0.1:8000/users/", not "127.0.0.1:8000/users")
* json data
* usable with browser, curl, httpie, postman etc. on browsers there a django visual display
* using httpie : 
  * acvtivate virtual environnement (cf. script)  
  * `python -m pip install httpie`  
  * get all users : `http 127.0.0.1:8000/users/`  
  * create new one: `http POST 127.0.0.1:8000/games/ score=10 opp_score=3` (httpie automaticly jsonize the body ; using curl you need to format data in json)  
  * retrieve id user: `http 127.0.0.1:8000/uid/`  
  * update is user: `http PUT 127.0.0.1:8000/uid/ username=blabla email=truc@gmail.com`  
  * delete user: `http DELETE 127.0.0.1:8000/uid/`  
* some fields are automatic and cannot be edited (uid, Game.date etc cf. base/models.py)  
* for images uploads, its easier via browser:
  * go to 127.0.0.1:8000/uploads/ -> get all images
  * upload image : scroll down, give a name, select image, and press post  
  * retrieve in static: django/mysite/media/image/  
  * get it back from the API: 127.0.0.1:8000/uploads/[img_id]/ -> displayed in browser

### 16/10/2024 19h30:  
* API is working for models: User, Game and IMG_TEST  
* using different DRF classes (APIviews, mixin, generic.views)
* still some issues for customizing mixin and generics:
  * customization per method
  * using different serializer for different "type" of request (i.e user password at creation or update, but NEVER for a user listing)
* crsf token completly unmanaged (unset drf permisisons in settings)
* jwt should just be a middleware (jwt simple)
* images on special class (not integrated as user.avatar yet), pb in retireve if img is null (need to find the rifht exception to catch), must be turned into class

### 16/10/2024 11h30:  
* on arrete les websocket pour passer django en REST API avec DRF (views + serializer)  
* plus besoin de channels et de daphne  
* index.html sera servi par nginx, le reste de la navigation en js  
* backend data sera envoye au site par http get/post/put/delete  


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




