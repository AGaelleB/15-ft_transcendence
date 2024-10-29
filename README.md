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

## Authentication vs Permission
### Authentication
* Meaning: validating your idendity with the server (without user to input credentials everytime)
* How: via JWToken given at login, sent as authorization header in any following request, so Django can identify a request.user
### Permission
* Meaning: what a authenticated user can do
* How: per view, using class that customize rest_framework.permissions.BasePermissions (cf permissions.py) 
* there is also a way of setting permissions per user, but I dont know if interesting here (all normal users have same type of rights)

## How to get a token, and use it?
* create a user via a POST at 127.0.0.1:8001/users/ (you first need to login the superuser)
* get a token: POST at 127.0.0.1:8001/login/ with username and password in body (json format)
* the server should reply a body with an acces and a refresh one. Store both.
* example of a JWToken (approx. 230 char) : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwMDYyOTkwLCJpYXQiOjE3MzAwNTkzOTAsImp0aSI6IjU4YzQ1ODhlM2FlNTQ5YWZiM2U4Y2ZiNjhlYzMzNDhkIiwidXNlcl9pZCI6MTB9.j9oH7PFOWjvaFmNzrCn6_sIJLtXetHfDyw-yTQQ8Fw0"
* include the access token in all requests for that user, in a header formatted as **"Authorization: Bearer JWT"** (JWT is the access token string)
* note that "login" and "getting a token" is the same thing. you post username and password at login/, it makes the user connected and you got both tokens in the body response. 

## Token security
* They must be stored somewhere in the front. LocalSession vs LocalStorage? Cookie possible?
* Access and Refresh token are related to a specific user (user.id and username in the token payload when decoded) 
* The refresh token is blacklisted on user logout --> it wont work for any new refresh demand
* The acces token cannot be blacklisted. People rely on its short lifetime ... which is not enough for me.
* In order to also make access token unusable after user logout: 
  * on logout, we set user.is_connected to False
  * on every route that requires an access token, we add a check on user.is_connected == True

## How to use superuser
* created by django at startup, with username and password in env file
* front end can login it like a normal user (POST 127.0.0.1:8001/login/ with username and password), and must use its access token in any request
  * this means that we need to share the username and password to the front (via env file), and store its tokens too

## API Routes
### `login/` : POST
* POST: connect user and returns JWTokens. Protection: none (on the route, but verification username/password for success/failure)  
`POST 127.0.0.1:8001/login/ {username=userblabla, password=blabla}`

### `logout/` : POST
* POST: disconnected user and blacklist refresh token. Protection: authenticated user must be user to logout  
`POST 127.0.0.1:8001/logout/ "Authorization: Bearer AccesJWT" {refresh=RefreshJWT}`  
note: since I check authentication a user can only blacklist himself. It may be unnecessary ; simple-jwt blacklisting does not check authentication

### `/users/` : GET, POST
* GET: list all users. Protection: any authenticated user  
`GET 127.0.0.1:8001/users/ "Authorization: Bearer AccesJWT"`
* POST: create new user. Protection: only authenticated superuser  
`POST 127.0.0.1:8000/users/ "Authorization: Bearer AccesJWT" {"username": "user", password="blabla" "email": "user@gmail.com", "is_2fa": false}`

### `/users/<str:username>/` : GET, PUT, DELETE
* GET: retrieve one user infos. Protection: any authenticated user  
`GET 127.0.0.1:8001/users/username/ "Authorization: Bearer AccesJWT"`
* PUT: update user info. Protection: authenticated user must be user to update  
`PUT 127.0.0.1:8001/users/username/ "Authorization: Bearer AccesJWT" {"username": "new_user_name"} `
* DELETE: destroy one user. Protection: authenticated must be user to destroy  
`DELETE 127.0.0.1:8001/users/username/ "Authorization: Bearer AccesJWT"`  
note: superuser cannot update/delete other users. 

### `/users/<str:username>/avatar/` : GET
* GET: serve the actual image avatar in binary, no json. Protection: any authenticated user  
`GET 127.0.0.1:8001/users/user/avatar/ "Authorization: Bearer AccesJWT"`  

### `/users/<str:username>/remove-friend/<str:friend>/` : PUT
* PUT: remove friend from username friend list. Protection: auth user must be user, not friend  
`PUT 127.0.0.1:8001/users/user1/remove-friend/user2/ "Authorization: Bearer AccesJWT"`  
note: it is symetrical (user2 removed from user1 firends, and user1 removed from user2 friends). However, you need to provide the right access token: token of user2 in that example wont work, it needs user1 token. 

### `/friend-request/` : GET
* GET: list all pending friends requests. Protection: any authenticated user
* `GET 127.0.0.1:8001/friend-request/ "Authorization: Bearer AccesJWT"`

### `/friend-request/create/` : POST
* POST: create request from sender to receiver. Protection: auth user must be sender  
`POST 127.0.0.1:8001/friend-request/ sender=1 receiver=2`  
note: provide user_id for sender/receiver. sender cannot resend a request to user2, neither user2 towards user1. if they are friends already, it fails.  

### `/friend-request/<int:pk>/` : GET (pk=request_id)
* GET: retrieve request. Protection: any authenticated user  
`GET 127.0.0.1:8001/friend-request/1/ "Authorization: Bearer AccesJWT"`  

### `/friend-request/<int:pk>/<str:action>/` : PUT (action= 'accept' | 'decline')
* PUT: accept/decline request. Protection: auth user must be receiver  
`PUT 127.0.0.1:8001/friend-request/1/accept/ "Authorization: Bearer AccesJWT"`  
`PUT 127.0.0.1:8001/friend-request/1/decline/ "Authorization: Bearer AccesJWT"`   
note: delete the request, and if str=='accept', add both users as friends  

### `/games/` : GET, POST
* `GET 127.0.0.1:8000/games/`
* `POST 127.0.0.1:8000/games/ {"score": 0, "opp_score": 0}` (create game with score=0 opp_score=0)
### `/games/<int:pk>/` : GET, PUT, DELETE. pk=game_id
* `GET 127.0.0.1:8000/games/1/`
 * `PUT 127.0.0.1:8000/games/1/ score=5`
 * `DELETE 127.0.0.1:8000/games/1/`




## Journal
#### 29/10/2024 19h15:
* user/avatar/ --> only retrieve view + auth + perm (any user; should we change to owner? i dont think so)
* remove-friend/ --> auth + perm (user must be user that remove its friend)
* friend-request list --> auth+perm (any auth user)
* friend-request retrieve --> auth+perm (any auth user)
* friend-request create --> auth + perm (sender, via permission)
* friend-request accept/decline --> auth + perm (receiver, in view bc no body and we cant get pk in perm)
* Todo:
  * check if OPTIONS avaible on all routes (for fetch), check routes where permission does not set options
  * games: 
    * Create: superuser perm
    * list and retrieve: authenticated user
    * remove destroy? 
  * mkcert 


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
