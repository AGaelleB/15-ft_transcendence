from django.urls import re_path
from . import consumer

websocket_urlpatterns = [
   # re_path(r'ws/some_path/$', consumer.MyConsumer.as_asgi()),
    re_path(r'ws/user_creation/$', consumer.UserCreationConsumer.as_asgi()),
    re_path(r'ws/user_listing/$', consumer.UserListingConsumer.as_asgi()),
    re_path(r'ws/user_info/$', consumer.UserInfoConsumer.as_asgi()),
    re_path(r'ws/user_connected/$', consumer.UserConnectedConsumer.as_asgi()),
]
