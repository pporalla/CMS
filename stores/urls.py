from django.urls import path
from .views import ItemListView, OrderListView

urlpatterns = [
    path('items/', ItemListView.as_view(), name='item-list'),
    path('orders/', OrderListView.as_view(), name = 'orders-list'),
]