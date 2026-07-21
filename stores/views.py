from .models import Store, Order, Item
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import ItemSerializer, OrderSerializer

#views
class ItemListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # 1. Ask the database for every item
        items = Item.objects.all()
        
        # 2. Hand the database items to the translator 
        # (many=True tells it we are passing a list, not just one item)
        serializer = ItemSerializer(items, many=True)
        
        #data to React
        return Response(serializer.data)
    
class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        
        return Response(serializer.data)