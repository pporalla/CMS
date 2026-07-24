from rest_framework import serializers
from .models import Item, Order
class ItemSerializer(serializers.ModelSerializer):
    # This automatically calls the __str__ method on the Store model, 
    # giving you the name instead of just the ID number.
    store = serializers.StringRelatedField()    
    class Meta:
        model = Item
        # Tell Django exactly which fields you want it to translate to JSON
        fields = ['item_id', 'item_name', 'quantity', 'store']
    
    
class OrderSerializer(serializers.ModelSerializer):
    
    # This automatically grabs the name of the marketplace and store instead of just the ID number
    marketplace = serializers.StringRelatedField()
    store = serializers.StringRelatedField()
    class Meta:
        model = Order
        fields = ['order_id', 'order_name', 'marketplace', 'store', 'mrp', 'discount', 'selling_price', 'order_date']