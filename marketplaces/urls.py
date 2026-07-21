from django.urls import path
from .views import MarketplaceListView

urlpatterns = [
    path('marketplaces/', MarketplaceListView.as_view(), name='marketplace-list'),
]