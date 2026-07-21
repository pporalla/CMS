from django.db import models

# Create your models here.
class Marketplace(models.Model):
    m_id = models.AutoField(primary_key=True) 
    name = models.CharField(max_length=100, unique=True) 
    created_at = models.DateTimeField(auto_now_add=True) # Sets exact time when created
    modified_at = models.DateTimeField(auto_now=True)    # Updates exact time whenever saved

    def __str__(self):
        return self.name