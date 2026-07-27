from django.contrib import admin
from .models import Store, Order, Item, OrderItem

# Register your models here.

class StoreAdmin(admin.ModelAdmin):
    list_display = ('store_id', 'store_name', 'store_code', 'store_address', 'pincode')
    search_fields=('store_id', 'store_name', 'store_code', 'store_address', 'pincode')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1 # Shows one blank row by default for the manager to fill out
    
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'order_name', 'marketplace', 'store', 'status' ,'mrp', 'discount', 'selling_price', 'order_date')
    list_filter = ('marketplace', 'store', 'order_date')
    search_fields = ('order_id', 'order_name', 'marketplace__name', 'store__store_name')
    # This magic line injects the items grid into the Order page
    inlines = [OrderItemInline]
    
class ItemAdmin(admin.ModelAdmin):
    list_display = ('item_id', 'item_name', 'quantity', 'store')
    list_filter = ('store',)
    search_fields = ('item_id', 'item_name', 'store__store_name')
    

admin.site.register(Store, StoreAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(OrderItem)


    