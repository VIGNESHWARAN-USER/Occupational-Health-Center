from django.shortcuts import render
from django.http import HttpResponse 
# Create your views here.

def home(request): 
    return HttpResponse("Hello World!")

def calc(request):
    return HttpResponse("Calc Home page")

def htmlpage(request):
    return render(request, 'index.html')