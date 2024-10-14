from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, "base/index.html")

def user_form(request):
    return render(request, "base/user_form.html")

def user_info(request):
    return render(request, "base/user_info.html")

''' 
second arg "path" needed because re_path (cf. urls.py) returns the match pattern (against the given regex)
it permits to adapt the views code depending on the real pattern matched
not needed for path() bc it matchs a fixed pattern
'''
def user_listing(request, path=None):
    return render(request, "base/user_listing.html")
