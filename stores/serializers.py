from rest_framework import serializers
from .models import Item, Order, OrderItem
class ItemSerializer(serializers.ModelSerializer):
    # This automatically calls the __str__ method on the Store model, 
    # giving you the name instead of just the ID number.
    store = serializers.StringRelatedField()    
    class Meta:
        model = Item
        # Tell Django exactly which fields you want it to translate to JSON
        fields = ['item_id', 'item_name', 'quantity', 'store']
    
class OrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.item_name', read_only=True)
    # Calculates if this specific item has enough stock
    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'item_name', 'quantity', 'in_stock']

    def get_in_stock(self, obj):
        return obj.item.quantity >= obj.quantity    
    
class OrderSerializer(serializers.ModelSerializer):    
    # This automatically grabs the name of the marketplace and store instead of just the ID number
    marketplace = serializers.StringRelatedField()
    store = serializers.StringRelatedField()
    # Nests the list of items inside the order JSON
    order_items = OrderItemSerializer(many=True, read_only=True)
    
    # Tells React if the entire order is ready to go or if something is missing
    can_fulfill = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['order_id', 'order_name', 'status', 'marketplace', 'store', 'mrp', 'discount', 'selling_price', 'order_date', 'order_items', 'can_fulfill']

    def get_can_fulfill(self, obj):
        # If any single item is short on inventory, the whole order gets flagged
        for order_item in obj.order_items.all():
            if order_item.item.quantity < order_item.quantity:
                return False
        return True        