from django.contrib import admin
from .models import Store, Order, Item

class StoreAdmin(admin.ModelAdmin):
    list_display = ('store_id', 'store_name', 'store_code', 'store_address', 'pincode')
    search_fields=('store_id', 'store_name', 'store_code', 'store_address', 'pincode')
    
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'order_name', 'marketplace', 'store', 'mrp', 'discount', 'selling_price', 'order_date')
    list_filter = ('marketplace', 'store', 'order_date')
    search_fields = ('order_id', 'order_name', 'marketplace__name', 'store__store_name')
    
class ItemAdmin(admin.ModelAdmin):
    list_display = ('item_id', 'item_name', 'quantity', 'store')
    list_filter = ('store',)
    search_fields = ('item_id', 'item_name', 'store__store_name')
    

admin.site.register(Store, StoreAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Item, ItemAdmin)


    