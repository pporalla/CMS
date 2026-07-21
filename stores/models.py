from django.db import models

class Store(models.Model):
    # primary_key=True makes this the unique identifier. 
    # blank=True allows the form to be empty initially because we generate it via code.
    
    store_id = models.CharField(max_length=15, primary_key=True, blank=True)
    store_name = models.CharField(max_length=255)
    store_code = models.IntegerField(unique=True, null=True, blank=True)
    store_address = models.TextField()
    pincode = models.CharField(max_length=10)
    

    def __str__(self):
        # This just ensures Django displays the store's name in menus instead of "Store Object(1)"
        return self.store_name
    
    #this will run after the store_name is saved to the database. It will generate a unique store_id based on the first 3 letters of the store name and a sequential number.
    def save(self, *args, **kwargs):
        # Only generate a new ID if this store doesn't have one yet (it's brand new)
        if not self.store_id:
            # 1. Grab the first 3 letters of the store name and make them UPPERCASE
            prefix = self.store_name[:3].upper()
            
            # 2. Search the database for the last added store that has this exact prefix.
            # order_by('-store_id') sorts them backwards, so the highest number is at the top.
            # .first() grabs that highest one.
            last_store = Store.objects.filter(store_id__startswith=prefix).order_by('-store_id').first()
            
            # 3. If a previous store exists, slice off the letters to get the number (e.g., '001' -> 1)
            # If no store exists yet, use 0.
            last_number = int(last_store.store_id[3:]) if last_store else 0
            
            # 4. Add 1 to the last number. 
            # The {:03d} forces the number to be 3 digits long (so 1 becomes '001').
            self.store_id = f"{prefix}{last_number + 1:03d}"
            
        # 5. Finally, execute Django's normal save process to push it to the database
        super().save(*args, **kwargs)

class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(default=0)
    
    # Its linking to store
    store = models.ForeignKey('Store', on_delete=models.CASCADE, related_name='items')
    
    def __str__(self):
        return self.item_name

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    order_name = models.CharField(max_length=30)
    
    marketplace = models.ForeignKey(
        'marketplaces.Marketplace', 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='orders'
    )
    
    store = models.ForeignKey('Store', on_delete=models.CASCADE, related_name='orders')
    
    # Pricing
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Order date
    order_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.order_id} - {self.order_name}"