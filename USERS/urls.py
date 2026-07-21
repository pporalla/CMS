from django.urls import path
from .views import SignupView, UserProfileView
# These are the built-in JWT login views!
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Route for signing up: http://localhost:8000/api/users/signup/
    path('signup/', SignupView.as_view(), name = 'signup'),
    
    # Route for logging in: http://localhost:8000/api/users/login/
    # This automatically expects an 'email' and 'password' and returns the JWT token.
    path('login/', TokenObtainPairView.as_view(), name = 'login'),
    
    # Route to refresh the token when it expires
    path('login/refresh/', TokenRefreshView.as_view(), name = 'token_refresh'),
    
    path('profile/', UserProfileView.as_view(), name = 'profile'),
]