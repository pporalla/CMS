from django.db import models
# We import AbstractBaseUser to get secure passwords and login capabilities for free
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

#Not cms manager. It is used to get the defualt fields like is_staff, is_active, superuser, etc..
class StoreUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # This is required by Django, even if we aren't using superusers right now
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class StoreUser(AbstractBaseUser, PermissionsMixin):
    #PermissionsMixin in Django is a built-in tool that adds the database fields and methods needed for groups and user permissions.
    
    user_id = models.CharField(max_length=15, primary_key=True, blank=True)
    
    # We link the User to the Store using a ForeignKey. 
    # Notice we use the string 'stores.Store'. This tells Django to look in the 'stores' app
    store = models.ForeignKey('stores.Store', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    
    # Linking the User to Marketplaces (Many-To-Many)
    marketplaces = models.ManyToManyField('marketplaces.Marketplace', blank=True, related_name='employees')
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mobileno = models.CharField(max_length=10, unique=True)
    address = models.TextField()
    is_staff = models.BooleanField(default=False) 
    is_active = models.BooleanField(default=True)

    # Django requires us to declare which field acts as the login username.
    USERNAME_FIELD = 'email'
    objects = StoreUserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user_id})"

    def save(self, *args, **kwargs):
        # Only generate if the user is brand new
        if not self.user_id:
            # The prefix is always EMP for employees
            prefix = "EMP"
            
            # Find the employee with the highest ID number
            last_user = StoreUser.objects.filter(user_id__startswith=prefix).order_by('-user_id').first()
            
            # Extract the number, add 1, and format it to 3 digits (EMP001, EMP002, etc.)
            last_number = int(last_user.user_id[3:]) if last_user else 0
            self.user_id = f"{prefix}{last_number + 1:03d}"
            
        # Save to the database
        super().save(*args, **kwargs)