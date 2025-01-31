from django.db import models # type: ignore

# Create your models here.

class Users(models.Model):
    username = models.CharField(max_length=100)  
    password = models.CharField(max_length=50)  
    access_level = models.CharField(max_length=50)  

    def __str__(self):
        return self.username  
