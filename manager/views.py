from rest_framework import status
from .serializers import EmployeeListSerializer, ManagerStoreSerializer, ManagerMarketplaceSerializer, ManagerItemSerializer, ManagerOrderSerializer
from stores.models import Order
from rest_framework.response import Response
from USERS.models import StoreUser
from USERS.serializers import UserSignupSerializer 
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from marketplaces.models import Marketplace
from stores.models import Store, Item

# Create your views here.

class ManagerEmployeeView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        employee = StoreUser.objects.all()
        serializer = EmployeeListSerializer(employee, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Employee created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
class ManagerEmployeeDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def patch(self, request,user_id):
        try:
            employee = StoreUser.objects.get(user_id=user_id)
        except StoreUser.DoesNotExist:
            return Response({"message": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = EmployeeListSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Employee updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ManagerStoreListView(APIView):
    # CRITICAL: IsAdminUser guarantees that standard employees cannot access this URL.
    # IsAuthenticated ensures the user has provided a valid JWT token.
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # Query the database for every store that exists
        stores = Store.objects.all()
        
        # Pass the database objects into our serializer to convert them into JSON.
        # many=True is required because we are translating a list of objects, not just one.
        serializer = ManagerStoreSerializer(stores, many=True)
        
        # Return the JSON payload to the React frontend with a default 200 OK status
        return Response(serializer.data)


class ManagerMarketplaceListView(APIView):
    # Enforce the same strict manager-level security
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # Query all marketplaces from the database
        marketplaces = Marketplace.objects.all()
        
        # Convert them to JSON using the lightweight serializer we just built
        serializer = ManagerMarketplaceSerializer(marketplaces, many=True)
        
        # Send the data back to React
        return Response(serializer.data)
    
class ManagerItemListView(APIView):
    # Security check: Only authenticated users with manager privileges (is_staff=True) can access this.
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # Retrieve absolutely every item in the database across all stores.
        # This gives the manager a global "birds-eye view" of the entire enterprise inventory.
        items = Item.objects.all()
        
        # Serialize the database objects into JSON format.
        # many=True tells DRF that 'items' is a list (QuerySet), not a single object.
        serializer = ManagerItemSerializer(items, many=True)
        
        # Send the processed JSON data back to the frontend.
        return Response(serializer.data)
        
    def post(self, request):
        # A manager might also need to create new items in the system globally.
        # We pass the incoming JSON data to the serializer.
        serializer = ManagerItemSerializer(data=request.data)
        
        # Validate the data (checks for correct data types, required fields, etc.)
        if serializer.is_valid():
            # Save the new item to the database.
            serializer.save()
            # Return a 201 Created status to let React know the item was successfully added.
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        # If the data is invalid (e.g., missing a required field), return exactly what went wrong.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ManagerOrderListView(APIView):
    # Security check: Strictly limit access to managers
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # Retrieve every order in the entire system, bypassing the store-level filters
        # order_by('-order_date') ensures the newest orders appear at the top of the manager's list
        orders = Order.objects.all().order_by('-order_date')
        
        # Serialize the list of order objects into JSON
        serializer = ManagerOrderSerializer(orders, many=True)
        
        # Return the global list to the React dashboard
        return Response(serializer.data)


class ManagerOrderDetailView(APIView):
    # Security check: Strictly limit access to managers
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, order_id):
        # Find the specific order the manager wants to update
        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        # partial=True allows the manager to update just one field, like re-assigning the 'store'
        serializer = ManagerOrderSerializer(order, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Save the updated routing/financial data to the database
            serializer.save()
            return Response({"message": "Order updated successfully", "data": serializer.data})
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)