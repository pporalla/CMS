from .models import Store, Order, Item
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import ItemSerializer, OrderSerializer

class ItemListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # 1. Superusers and Managers see EVERYTHING across all stores and marketplaces.
        if user.is_superuser or user.is_manager:
            items = Item.objects.all()
            
        # 2. Employees ONLY see items for their specific assigned store.
        elif user.is_employee and user.store:
            items = Item.objects.filter(store=user.store)
            
        # 3. Fallback for unassigned users
        else:
            items = Item.objects.none()
            
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)
    
class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # 1. Superusers and Managers see all orders everywhere.
        if user.is_superuser or user.is_manager: 
            orders = Order.objects.all()
            
        # 2. Employees ONLY see orders assigned to their store.
        elif user.is_employee and user.store:
            orders = Order.objects.filter(store=user.store)
            
        # 3. Fallback
        else:
            orders = Order.objects.none()
            
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)