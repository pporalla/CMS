from django.contrib import admin
from .models import Marketplace
# Register your models here.

class MarketPlaceAdmin(admin.ModelAdmin):
    list_display=('m_id', 'name', 'created_at', 'modified_at')
    search_fields=('m_id', 'name')
    list_filter=('created_at', 'modified_at')
    # Since created_at and modified_at are auto-generated, we make them read-only 
    # so they appear on the edit screen but cannot be accidentally altered by a manager.
    readonly_fields=('created_at', 'modified_at')
    

admin.site.register(Marketplace, MarketPlaceAdmin)