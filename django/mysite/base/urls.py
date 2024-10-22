from django.urls import path, re_path
from . import views

urlpatterns = [
    # users
    path('users/', views.UserListCreate.as_view(), name='all users'),
    path('users/<int:pk>/', views.UserRUD.as_view(), name='single user'),
    path('users/<int:pk>/avatar/', views.User_avatar.as_view(), name='user avatar full image'),
    path('users/<str:username>/log<str:action>/', views.User_log_in_out.as_view(), name='user login/logout'),
    path('users/<int:pk>/remove-friend/<int:friend>/', views.User_remove_friend.as_view(), name='user remove single friend'),
    # games
    path('games/', views.GameListGeneric.as_view()),
    path('games/<int:pk>/', views.GameDetailGeneric.as_view()),
    # friend request
    path('friend-request/', views.FriendRequest_list.as_view(), name='all friend requests'),
    path('friend-request/create/', views.FriendRequest_create.as_view(), name='friends request create'),
    path('friend-request/<int:pk>/', views.FriendRequest_retrieve.as_view(), name='single friend request'),
    path('friend-request/<int:pk>/<str:action>/', views.FriendRequest_accept_decline.as_view(), name='accept/decline a friend request'),
]
