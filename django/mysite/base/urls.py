from django.urls import path, re_path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("user_form/", views.user_form, name="user_form"),
    #path("user_listing/", views.user_listing, name="user_listing"),
    re_path(r'^user_(listing|list)/$', views.user_listing, name="user_listing"),
]
