from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, "base/index.html")
#   return HttpResponse("Hello, transcendance. (index page of transcendance for now)")
