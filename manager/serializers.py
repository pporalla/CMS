from USERS.models import StoreUser 
from rest_framework import serializers
from stores.models import Store, Item, Order
from marketplaces.models import Marketplace

class EmployeeListSerializer(serializers.ModelSerializer):  
    class Meta:
        model = StoreUser
        fields = ['user_id', 'first_name', 'last_name', 'email', 'mobileno', 'store', 'marketplaces', 'is_active']

class ManagerStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        # We only send the store_id and store_name to React. 
        # Sending the entire store object wastes bandwidth when React only needs these two fields for a dropdown menu.
        fields = ['store_id', 'store_name']

class ManagerMarketplaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketplace
        # Similarly, we only need the m_id (primary key) and name (e.g., 'Amazon') to populate selection boxes.
        fields = ['m_id', 'name']
        
class ManagerItemSerializer(serializers.ModelSerializer):
    # This feature allows us to display the actual store name instead of just the ID number.
    # ReadOnlyField pulls the string representation (the __str__ method) from the related Store model.
    store_name = serializers.ReadOnlyField(source='store.store_name')

    class Meta:
        model = Item
        fields = ['item_id', 'item_name', 'store', 'store_name', 'quantity']
        
class ManagerOrderSerializer(serializers.ModelSerializer):
    # ReadOnlyField traverses the foreign key relationships to get the readable names.
    # This prevents your React frontend from having to make extra API calls just to find out that "store=1" means "Store Alpha".
    store_name = serializers.ReadOnlyField(source='store.store_name')
    marketplace_name = serializers.ReadOnlyField(source='marketplace.name')

    class Meta:
        model = Order
        # Including all crucial financial and routing fields for the Manager's global view.
        fields = [
            'order_id', 'order_name', 'store', 'store_name', 
            'marketplace', 'marketplace_name', 
            'mrp', 'discount', 'selling_price', 'order_date'
        ]