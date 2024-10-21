# Branch bastien   
### How to launch:
`cd django` (repo with script.sh and mysite)  
`source script.sh` : create a virtual env and get python packages  
`cd mysite ` : (repo with a file manage.py)  
`./launch.sh` : run the following commands to launch the server  
Django is now available on **127.0.0.1:8001** (not 8000)

#### launch.sh details
* ```python manage.py makemigrations``` : update migrations (if pb and db integrity no matter: rm -rf base/migrations 00*)  
* ```python manage.py migrate``` : migrate (create/update db)  
* ```python manage.py runserver``` : launch server  

### API use :
* available on 127.0.0.1:8000/  
* trailing '/' MANDATORY ("127.0.0.1:8000/users/", not "127.0.0.1:8000/users")
* using httpie : 
  * venv + package: `python -m venv .venv ; source .venv/bin/activate ; pip install httpie` 
  * get all users : `http 127.0.0.1:8000/users/`
  * create new game: `http POST 127.0.0.1:8000/games/ score=10 opp_score=3`
* using curl : 
  * Get all users : `curl 127.0.0.1:8000/users/`
  * POST/PUT : `curl -X POST URL -d "{\"key\": value, \"key2\": value2}"` (keys must be doublequoted, escaping needed)
  * delete user with id 3 : `curl -X DELETE 127.0.0.1:8000/users/3/`
* using browser (browsable DRF API):
  * go to the route, informations and expected data are nicely displayed
  * forms are provided for POST/PUT, with constraints


### API Routes
#### `/users/` : GET (list), POST (create, expect body)
* `GET 127.0.0.1:8000/users/`
* `POST 127.0.0.1:8000/users/ {"username": "user", "first_name": "blabla", "last_name": blibli, "email": "user@gmail.com", "is_2fa": false}`
#### `/users/<int:pk>/` : GET (retrieve), PUT (update partial, expect body), DELETE (destroy). pk is the user id
* `GET 127.0.0.1:8000/users/1/`
* `PUT 127.0.0.1:8000/users/1/ {"username": "new_user_name"}`
* `DELETE 127.0.0.1:8000/users/1/`
#### `/users/<int:pk>/avatar/` : GET (serve the actual image, no json)
* `GET 127.0.0.1:8000/users/1/avatar/`
#### `/users/<int:pk>/log<str:action>/` : PUT (update is_connected to True or False, no body). str= 'in' | 'out'
* `PUT 127.0.0.1:8000/users/1/login`
* `PUT 127.0.0.1:8000/users/2/logout`
#### `/users/<int:pk>/remove-friend/<int:friend>/` : PUT (update: rm one friend, no body). pk=user_id, friend=friend_id
* `PUT 127.0.0.1:8000/users/2/remove-friend/1` --> user2.friends.remove(user1), and it is symmetrical (user1.friends.remove(user2))
#### `/games/` : GET (list), POST (create, expecting body)
* `GET 127.0.0.1:8000/games/`
* `POST 127.0.0.1:8000/games/ {"score": 0, "opp_score": 0}` (create game with score=0 opp_score=0)
#### `/games/<int:pk>/` : GET (retrieve), PUT (update partial), DELETE (destroy). pk=game_id
* `GET 127.0.0.1:8000/games/1`
 * `PUT 127.0.0.1:8000/games/1 score=5`
 * `DELETE 127.0.0.1:8000/games/1`
#### `/friend-request/` : GET (list)
* `GET 127.0.0.1:8000/friend-reques//`
#### `/friend-request/create/` : POST (create, expect body)
* `POST 127.0.0.1:8000/friend-request/ sender=1 receiver=2` create a request from user1 to user2 (only user2 can accept/decline). user1 cannot resend a request to user2, neither user2 towards user1 !
#### `/friend-request/<int:pk>/` : GET (retrieve), pk=request_id
* `GET 127.0.0.1:8000/friend-request/1/` where 1 is the id of the request, not users
#### `/friend-request/<int:pk>/<str:action>/` : PUT (update+destroy). pk=request_id, action= 'accept' | 'decline'
* `PUT 127.0.0.1:8000/friend-request/1/accept/` accepts request id1 --> add both users as friends, destroy the request
* `PUT 127.0.0.1:8000/friend-request/1/decline/` decline request id1 --> just destroy the request. 



### 21/10/2024 12h30:
* users:   
  * now: list, create, retrieve, update, get avatar, login (no paswd yet), logout, remove friends (both friendship), destroy
  * todo : password/authentication
* games: 
  * now: list, create, retrieve, update (is update needed?)
  * todo: more fields for dashboard, link it to player. update to remove? destroy not needed?
* friend request:
  * now: list, create(if no existing request and not friends), retrieve, update (accept/decline): add both users as friend and destroy the request
  * todo: nothing?

list: returns all instances, GET  
retrieve: return one instance, GET  
create: creat one instance, POST  
update: change infos of one instance (partial update ok), PUT (PATCH not implemented)  
destroy: delete one instance, DELETE (sometimes via a PUT ie friend request)  


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




