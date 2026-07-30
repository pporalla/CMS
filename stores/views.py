from .models import Store, Order, Item
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import ItemSerializer, OrderSerializer, StoreSerializer


class CreateStoreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # SECURITY: Verify the user is actually in the Manager group
        is_manager = request.user.groups.filter(name='Manager').exists() 
        if not is_manager:
            return Response(
                {"error": "Unauthorized. Only Managers can create new stores."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        # Pass the React data to the serializer
        serializer = StoreSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Store created successfully!", "store": serializer.data}, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ItemListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # 1. Superusers and Managers see EVERYTHING across all stores and marketplaces.
        if user.is_superuser or user.is_manager:
            items = Item.objects.all()
            
        elif user.is_employee and user.store:
            items = Item.objects.filter(store=user.store)
            
        else:
            items = Item.objects.none()
            
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)
    
class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        if user.is_superuser or user.is_manager: 
            orders = Order.objects.all()
        
        elif user.is_employee and user.store:
            orders = Order.objects.filter(store=user.store)
            
        else:
            orders = Order.objects.none()
            
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)