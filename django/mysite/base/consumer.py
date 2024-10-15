import json, re
from channels.generic.websocket import WebsocketConsumer
from django.core.exceptions import ObjectDoesNotExist
from .models import User

'''
Consumers are the websocket server side (client side ones are those declared in the js in the html served to user)
It accepts connection from the client, read what was sent, and is able to reply
WebsocketConsumer herits from Consumer which is based on a ASGI app
ASGI has a scope and an event (cf. https://asgi.readthedocs.io/en/latest/specs/www.html#websocket)
    - scope : python dict with at least a "type" key ; it mainly contains conection infos (proto, version, host). the key "state" is interesting
    - event : either send or receive, is a python dict with 3 components(type, bytes, text)
        - type : websocket.receive or websocket.send (Connect, Accept, Disconnect, Close are special send/receive events)
        - data is sent into bytes XOR text (exaclty one of both must be None). I guess images/audio etc must be in binary format via bytes
    - meant to be asynchronous but not mandatory (native compatibility with wsgi)
    - can bu used with TLS (cf. doc chapter TLS extension)
    - not only for websocket (http and other protocols can fit in)

Channels.consumer makes asgi app directy usable in django. event are renamed "message"
Channels.generic.Websocket just make it suitable for only websocket (ie ws.send(data) set scope["type"]="websocket.send"; channel source code in .venv is very comprehensive)
I still dont understand why we should pass the data into json format. There are also Channels.generic.JsonWebsocket that directly en/decodes json messages
The scope is per websocket (no native communication between websockets or with other processes), but
Channels offers layers and groups to broadcast messages to multiples websockets/clients/processes (just register to a group)

They are sync or async (AsyncWebsocketConsumer). in asgiref there are sync_to_async functions for compatibility
Accessing the db with asyncConsumers must always happen with "database_sync_to_async" to avoid accessing same data by several async
(db is turned into async mode rather that consumer in a sync mode)

Async is usefull/mandatory for layers and groups : I might need them to deal with two differents clients from two differents tabs 
note: async consumer must be implemented with async python syntax function (async + wait, or decorator)
'''

def check_user_form_validity(form_data) -> str:
    user_name = form_data['user_name']
    first_name = form_data['first_name']
    last_name = form_data['last_name']
    email = form_data['email']

    email_regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'

    if len(user_name) > 20:
        return "user_name too long"
    if len(first_name) > 20:
        return "first_name too long"
    if len(last_name) > 20:
        return "last_name too long"
    if not re.match(email_regex, email):
        return "invalid email format"
    return "Succes"


class UserCreationConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'submit_form':
            form_data = data.get('form_data')
            print("Form data:")
            print(form_data)
        else:
            self.send(text_data=json.dumps({'status': 'unrecognized action'}))
        
        if (check_user_form_validity(form_data) == "Succes" ):
            self.send(text_data=json.dumps({'status': 'Success, user created'}))
            user = User(form_data['user_name'], form_data['first_name'], form_data['last_name'], form_data['email'])
            user.is_connected = True
            user.save()
        else:
            reason = f"Failure: {check_user_form_validity(form_data)}"
            self.send(text_data=json.dumps({'status': reason}))
            
    def disconnect(self, close_code):
        pass


class UserListingConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

        userlist = {}
        users = User.objects.all()
        if not users:
            print("no user found, sending status=no data")
            self.send(text_data=json.dumps({'status': 'no data',}))
            return
        for user in users:
            userlist[str(user)] = f"Username:{str(user.username)}, email:{str(user.email)}, connected:{str(user.is_connected)}"
            self.send(text_data=json.dumps({'status': 'succes', 'user_list' : userlist}))

    def disconnect(self, close_code):
        pass


class UserConnectedConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

        userlist = {}
        users = User.objects.filter(is_connected=True)
        if not users:
            print("no connected users in db")
            self.send(text_data=json.dumps({'status': 'no data',}))
            return
        for user in users:
            userlist[str(user)] = f"{str(user.username)} is connected"
            self.send(text_data=json.dumps({'status': 'succes', 'user_list' : userlist}))

    def disconnect(self, close_code):
        pass


class UserInfoConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def send_user_info(self, user):
        user_info = {}
        user = User.objects.filter(pk=user)
        if not user:
            self.send(text_data=json.dumps({'status': 'unrecognized user'}))
            return
        for u in user:
            user_info[str(u)] = f"Username:{str(u.username)}, email:{str(u.email)}, connected:{str(u.is_connected)}, 2FA activated:{str(u.is_2fa)}"
        self.send(text_data=json.dumps({'status': 'get_info', 'info' : user_info}))

    def log_in(self, user=''):
        try:
            user = User.objects.get(pk=user)
        except User.DoesNotExist:
            return False
        user.is_connected = True
        user.save()
        self.send_user_info(user)
        return True

    def log_out(self, user=''):
        try:
            user = User.objects.get(pk=user)
        except User.DoesNotExist:
            return False
        user.is_connected = False
        user.save()
        self.send_user_info(user)
        return True

    def delete_user(self, user=''):
        try:
            user = User.objects.get(pk=user)
        except User.DoesNotExist:
            return False
        user.delete()
        return True

    def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        username = data.get('username')

        if action == 'get_info':
            self.send_user_info(username)
        elif action == 'log_in':
            if self.log_in(username) == False:
                self.send(text_data=json.dumps({'status': 'unrecognized user'}))
        elif action == 'log_out':
            if self.log_out(username) == False:
                self.send(text_data=json.dumps({'status': 'unrecognized user'}))
        elif action == 'change_info':
            self.send(text_data=json.dumps({'status': 'change_info sent'})) # into a new class for a separate webso
        elif action == 'delete_user':
            if self.delete_user(username) == True:
                self.send(text_data=json.dumps({'status': 'user_deleted'}))
            else:
                self.send(text_data=json.dumps({'status': 'unrecognized user'}))
        else:
            print("unrecognized action")
            self.send(text_data=json.dumps({'status': 'unrecognized action sent'}))


# could be integrated in userInfo
class UserUpdateConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        username = data.get('username')

        if action == 'get_info':
            UserInfoConsumer.send_user_info("yo") # lets try to call userinfo.send_user_info

    def disconnect(self, close_code):
        pass
