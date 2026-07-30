from django.urls import path
from .views import CreateStoreView, ItemListView, OrderListView

urlpatterns = [
    path('create/', CreateStoreView.as_view(), name='create-store'),
    path('items/', ItemListView.as_view(), name='item-list'),
    path('orders/', OrderListView.as_view(), name = 'orders-list'),
]