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
        #requesting user 
        user = request.user
        # 1. If the user is a manager, return everything
        if user.is_staff:
            items = Item.objects.all()
        # 2. If the user is an employee WITH an assigned store, filter by their store
        elif user.store:
            items = Item.objects.filter(store=user.store)
        # 3. If the user has no store assigned yet, return an empty list
        else:
            items = Item.objects.none()
        
        items = Item.objects.all()
        
        # many=True tells it we are passing a list, not just one item
        serializer = ItemSerializer(items, many=True)
        
        #data to React
        return Response(serializer.data)
    
class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        user = request.user
        if user.is_staff:
            orders = Order.objects.all()
        elif user.store:
            orders = Order.objects.filter(store=user.store)
        else:
            orders = Order.objects.none()
            
        serializer = OrderSerializer(orders, many=True)
        
        return Response(serializer.data)