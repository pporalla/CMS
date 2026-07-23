from django.urls import path, include
from .views import (ManagerEmployeeView, ManagerEmployeeDetailView, ManagerStoreListView, ManagerMarketplaceListView, ManagerItemListView,ManagerOrderListView, ManagerOrderDetailView)



urlpatterns = [
    path('employees/', ManagerEmployeeView.as_view(), name='manager-employees'),
    path('employees/<str:user_id>/', ManagerEmployeeDetailView.as_view(), name='manager-employee-detail'),

    path('stores/', ManagerStoreListView.as_view(), name='manager-stores'),
    path('marketplaces/', ManagerMarketplaceListView.as_view(), name='manager-marketplaces'),
    path('items/', ManagerItemListView.as_view(), name='manager-items'),
    
    path('orders/', ManagerOrderListView.as_view(), name='manager-orders'),
    # React calls 'PATCH /api/manager/orders/15/' to change an order's assigned store or details.
    path('orders/<int:order_id>/', ManagerOrderDetailView.as_view(), name='manager-order-detail'),
]
