from django.contrib import admin
from .models import StoreUser
# Register your models here.
admin.site.site_header="CMS Manager"
admin.site.site_title="CMS Admin Portal"
admin.site.index_title="Manager Dashboard"

class StoreUserAdmin(admin.ModelAdmin):
    # Creates the spreadsheet-like columns on the main list page
    list_display = ('user_id', 'first_name', 'email', 'store', 'is_staff', 'is_active')
    
    # Adds a clickable sidebar to quickly filter employees by their store or status
    list_filter = ('store', 'is_staff', 'is_active')
    
    # Creates a search bar that scans these specific text fields
    search_fields = ('user_id', 'email', 'first_name', 'mobileno')
    
    filter_horizontal =('groups', 'marketplaces')
    
    # Organizes the employee edit page into visual sections with headers
    fieldsets = (
        ('Personal Information', {
            'fields': ('user_id', 'first_name', 'last_name', 'email', 'mobileno', 'address')
        }),
        ('Business Assignments', {
            'fields': ('store', 'marketplaces')
        }),
        ('Permissions & Security', {
            'fields': ('is_staff', 'is_active', 'password', 'is_superuser', 'groups')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        # Django's default secure hashes start with 'pbkdf2_'. 
        # If the password doesn't start with this, it means you typed a new plain-text password.
        if obj.password and not obj.password.startswith('pbkdf2_'):
            # This built-in function applies the secure hash
            obj.set_password(obj.password)
            
        # Continue with the normal save process
        super().save_model(request, obj, form, change)
        
    # 1. PREVENT MANAGERS FROM DELETING OTHER MANAGERS OR SUPERUSERS
    def has_delete_permission(self, request, obj=None):
        if obj is not None:
            is_target_manager = obj.groups.filter(name='Manager').exists()
            
            if obj.is_superuser or is_target_manager:
                if not request.user.is_superuser:
                    return False
                    
        return super().has_delete_permission(request, obj)

    # 2. PREVENT MANAGERS FROM CHANGING SENSITIVE ROLES
    def get_readonly_fields(self, request, obj=None):
        if request.user.is_superuser:
            return self.readonly_fields
            
        return self.readonly_fields + ('is_superuser', 'is_staff', 'groups', 'user_permissions')

admin.site.register(StoreUser, StoreUserAdmin)