# Branch bastien   
## How to launch
* Copy an **".env"** file next to to docker-compose.yml (ie. `cp ~/.config/.env_transcendance ./.env`)  
* Launch: `docker-compose up -d --build` (remove -d to run in foreground)  
* Stop: `docker-compose down` (ctrl-c first if foreground)
* Remove images: `docker rmi -f $(docker images -a -q)`  
* Volumes:
  * must be in goinfre at 42 for non root docker
  * if not at 42, make sure you also **have a /goinfre** : `mkdir /goinfre`
  * only using it for postgre, path: /goinfre/pg-data
  * we cant use docker volume ls/rm (not using docker internal volume, for now)
  * erase the db: `rm -rf /goinfre/pg-data` (might not work at 42)

Frontend: **127.0.0.1:8000**  
Django:  **127.0.0.1:8001** (not 8000)  

### Env format (updated 27 october)
Same env file for django and postgres and front (might change it later)   
Mandatory:  
* DEBUG=True
* DJANGO_ADMIN_USERNAME=
* DJANGO_SUPERUSER_PASSWORD=
* DJANGO_SUPERUSER_EMAIL=
* POSTGRES_HOST=
* POSTGRES_DB=
* POSTGRES_USER=
* POSTGRES_PASSWORD=

### launch.sh details
note: since docker settings, **local launch don't work anymore**  
* ```python manage.py makemigrations``` : update migrations (if pb and db integrity no matter: rm -rf base/migrations 00*)  
* ```python manage.py migrate``` : migrate (create/update db)  
* ```python manage.py db_norm``` : apply changes on db at startup (ie: logout all users)
* ```python manage.py superuser``` : create superuser
* ```python manage.py runserver``` : launch server  

## Authentication
* Meaning: validating your idendity with the server (without user to input credentials everytime)
* How: via JWToken given at login, sent as authorization header in any following request, so Django can identify a request.user

## Permission
* Meaning: what a authenticated user can do
* How: per view, using class that customize rest_framework.permissions.BasePermissions (cf permissions.py) 
* there is also a way of setting permissions per user, but I dont know if interesting here (all normal users have same type of rights)

## How to get a token, and use it?
* create a user via a POST at 127.0.0.1:8001/users/ (superuser perm soon to be implemented, you'll then need to auth the superuser first)
* get a token via a POST at 127.0.0.1:8001/api/token/ (path soon to be changed to login/) with username and password in body (json format)
* the server should reply a body with an acces token (and a refresh one, to get a new access one when expired)
* example of a JWToken (approx. 230 char) : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwMDYyOTkwLCJpYXQiOjE3MzAwNTkzOTAsImp0aSI6IjU4YzQ1ODhlM2FlNTQ5YWZiM2U4Y2ZiNjhlYzMzNDhkIiwidXNlcl9pZCI6MTB9.j9oH7PFOWjvaFmNzrCn6_sIJLtXetHfDyw-yTQQ8Fw0"
* include it in all requests for that user, in a header formatted as "Authorization: Bearer JWT" (JWT is the actual token string)
* later, front end must store both acces and refresh token of a 'connected' user, but also those of the superuser (for creating user and game)


## API Routes
### `/users/` : GET, POST
* `GET 127.0.0.1:8000/users/`
* `POST 127.0.0.1:8000/users/ {"username": "user", "first_name": "blabla", "last_name": blibli, "email": "user@gmail.com", "is_2fa": false}`
### `/users/<str:username>/` : GET, PUT, DELETE
* Authentication needed for GET, PUT, DELETE
* Permissions (request.user == username in path) for PUT and DELETE
* `GET 127.0.0.1:8000/users/user/ "Authorization: Bearer JWT"`
* `PUT 127.0.0.1:8000/users/user/ {"username": "new_user_name"} "Authorization: Bearer JWT"`
* `DELETE 127.0.0.1:8000/users/user/ "Authorization: Bearer JWT"`
### `/users/<str:username>/avatar/` : GET (serve the actual image)
* `GET 127.0.0.1:8000/users/user/avatar/`
### `/users/<str:username>/log<str:action>/` : PUT
* ROUTES HAVE CHANGED: login/ logout/
* METHODS: only POST
* login body username= password=
* logout header Authorization, body refresh=
* `PUT 127.0.0.1:8000/users/user/login/`
* `PUT 127.0.0.1:8000/users/user/logout/`
### `/users/<str:username>/remove-friend/<str:friend>/` : PUT
* `PUT 127.0.0.1:8000/users/user1/remove-friend/user2/` --> user2.friends.remove(user1), and it is symmetrical (user1.friends.remove(user2))
### `/games/` : GET, POST
* `GET 127.0.0.1:8000/games/`
* `POST 127.0.0.1:8000/games/ {"score": 0, "opp_score": 0}` (create game with score=0 opp_score=0)
### `/games/<int:pk>/` : GET, PUT, DELETE. pk=game_id
* `GET 127.0.0.1:8000/games/1/`
 * `PUT 127.0.0.1:8000/games/1/ score=5`
 * `DELETE 127.0.0.1:8000/games/1/`
### `/friend-request/` : GET
* `GET 127.0.0.1:8000/friend-reques/`
### `/friend-request/create/` : POST
* `POST 127.0.0.1:8000/friend-request/ sender=1 receiver=2` create a request from user1 to user2 (only user2 can accept/decline). user1 cannot resend a request to user2, neither user2 towards user1 !
### `/friend-request/<int:pk>/` : GET. pk=request_id
* `GET 127.0.0.1:8000/friend-request/1/` where 1 is the id of the request, not users
### `/friend-request/<int:pk>/<str:action>/` : PUT. pk=request_id, action= 'accept' | 'decline'
* `PUT 127.0.0.1:8000/friend-request/1/accept/` accepts request id1 --> add both users as friends, destroy the request
* `PUT 127.0.0.1:8000/friend-request/1/decline/` decline request id1 --> just destroy the request. 


### Journal
#### 28/10/2024 21h30:
* route login/ --> give JWTokens to right creds user, turn is_connected to True
  * already log in user: serializer.ValidationError not to re-issue a pair of tokens
* route logout/ --> blacklist user Refresh tokens, turn is_connected to False. 
  * Cannot directly override TokanBlacklistView because it does not handle authentication, we use a view/seria that retrieve refresh from the request and then refresh.blacklist(), to ensure a user can only logout himself (if ever he could steal another connected user token)
  * problem: only refresh can be blacklisted, not acces! We may check that user is_connected on all routes that only required auth. People rely on acces lifetime, thats crazy!
* remove routes users/username/[login|logout]/
* permissions is_connected for routes that only require authentication
* Todo:
  * enforce user permissions (friend rmove and friend request) and superuser (on games)
  * login/logout superuser, tests needed
  * refresh token logic 
  * ssl certificates with mkcert that bypass sec warning? 


#### 27/10/2024 21h00:
* User inherits from AbsrtactUser for auth attributes (ie hash passwd)
* JWT given at api/token --> to be changed to login
* Auth + perm debut (cf. UserRUD: GET need auth, PUT/DELETE need auth + perm) 
* Superuser (class User ...) created at startup with creds in .env (to be used by frontend)
* secret key (used as salt for JWT) of 132bits rotating (gen at startup, no need in .env)
* Todo: 
  * enforce Auth and Perm for normal users everywhere (friend request, logout, remove-friend etc)
  * transform api/token to login
  * refresh token logic
  * handle logout (rm token, blacklist?, user.is_active?)
  * enforce superuser Auth in User.create and Game views
  * go deeper into permissions: should we set it per user instead of per view?

#### 23/10/2024 18h30:
* postgreSQL as db for django, via docker  
* django on docker  
* docker-compose to launch: frontend + django + postgre  
* .env needed by docker-compose

#### 21/10/2024 12h30:
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

#### 16/10/2024 19h30:  
* API is working for models: User, Game and IMG_TEST  
* using different DRF classes (APIviews, mixin, generic.views)
* still some issues for customizing mixin and generics:
  * customization per method
  * using different serializer for different "type" of request (i.e user password at creation or update, but NEVER for a user listing)
* crsf token completly unmanaged (unset drf permisisons in settings)
* jwt should just be a middleware (jwt simple)
* images on special class (not integrated as user.avatar yet), pb in retireve if img is null (need to find the rifht exception to catch), must be turned into class

#### 16/10/2024 11h30:  
* on arrete les websocket pour passer django en REST API avec DRF (views + serializer)  
* plus besoin de channels et de daphne  
* index.html sera servi par nginx, le reste de la navigation en js  
* backend data sera envoye au site par http get/post/put/delete  

## Modules
### Web
[X] Major module: Use a Framework as backend.
[X] Minor module: Use a front-end framework or toolkit.
[X] Minor module: Use a database for the backend -and more.
### User Management
[X] Major module: Standard user management, authentication, users across tournaments
### Gameplay and user experience
[X] Minor module: Game Customization Options.
### AI-Algo
[X] Major module: Introduce an AI Opponent
[] Minor module: User and Game Stats Dashboards.
### Cybersecurity
[] Major module: Implement Two-Factor Authentication (2FA) and JWT.
### Graphics
[en cours] Major module: Implementing Advanced 3D Techniques
### Accessibility
[] Minor module: Expanding Browser Compatibility.
[X] Minor module: Multiple language supports.
[] Minor module: Add accessibility for Visually Impaired Users
