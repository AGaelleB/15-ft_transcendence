from django.urls import path, re_path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # users
    path('users/', UserListCreate.as_view(), name='all users'),
    path('users/<str:username>/', UserRUD.as_view(), name='single user'),
    path('users/<str:username>/avatar/', User_avatar.as_view(), name='user avatar full image'),
    path('users/<str:username>/log<str:action>/', User_log_in_out.as_view(), name='user login/logout'),
    path('users/<str:username>/remove-friend/<str:friend>/', User_remove_friend.as_view(), name='user remove single friend'),
    # games
    path('games/', GameListGeneric.as_view()),
    path('games/<int:pk>/', GameDetailGeneric.as_view()),
    # friend request
    path('friend-request/', FriendRequest_list.as_view(), name='all friend requests'),
    path('friend-request/create/', FriendRequest_create.as_view(), name='friends request create'),
    path('friend-request/<int:pk>/', FriendRequest_retrieve.as_view(), name='single friend request'),
    path('friend-request/<int:pk>/<str:action>/', FriendRequest_accept_decline.as_view(), name='accept/decline a friend request'),
    # JWT
    path('login/', UserLogin.as_view(), name='login_and_get_tokens'),
    path('logout/', UserLogout.as_view(), name='logout_and_blacklist_tokens'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
