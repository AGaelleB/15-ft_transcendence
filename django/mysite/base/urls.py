from django.urls import path, re_path
from . import views

urlpatterns = [
    # API VIEWS
    path('users/', views.UserListCreate.as_view()),
    path('users/<int:pk>/', views.UserRUD.as_view()),
    path('games/', views.GameList.as_view()),
    path('games/<int:pk>/', views.GameDetail.as_view()),
    path('gamesG/', views.GameListGeneric.as_view()),
    path('gamesG/<int:pk>/', views.GameDetailGeneric.as_view()),
    # images
    path('upload/', views.ImageViewSet.as_view(), name='upload'),
    path('upload/<int:pk>/', views.ImageViewSet.as_view(), name='retrieve img'),
    # friend invite
    path('friends/', views.FriendRequest_list.as_view(), name='friends request list'),
    path('friends/<int:pk>/', views.FriendRequest_retrieve.as_view(), name='retr friends requests'),
    path('friends/<int:pk>/<str:action>/', views.FriendRequest_accept_decline.as_view(), name='accept/decline friend request'),
    path('friends/create/', views.FriendRequest_create.as_view(), name='friends request create'),
]
