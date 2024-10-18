from django.urls import path, re_path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("user_form/", views.user_form, name="user_form"),
    path("user_info/", views.user_info, name="user_info"),
    path("user_connected/", views.user_connected, name="user_info"),
    re_path(r'^user_(listing|list)/$', views.user_listing, name="user_listing"),
    # API VIEWS
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.user_detail),
    path('games/', views.GameList.as_view()),
    path('games/<int:pk>/', views.GameDetail.as_view()),
    path('gamesG/', views.GameListGeneric.as_view()),
    path('gamesG/<int:pk>/', views.GameDetailGeneric.as_view()),
    # images
    path('upload/', views.ImageViewSet.as_view(), name='upload'),
    path('upload/<int:pk>/', views.ImageViewSet.as_view(), name='retrieve img'),
    # friend invite
    path('friends/', views.friend_invite_list_retrieve.as_view(), name='friends invite list'),
    path('friends/<int:pk>/', views.friend_invite_list_retrieve.as_view(), name='retr friends invite'),
    path('friends/create/', views.friend_invite_create.as_view(), name='friends invite create'),
]
