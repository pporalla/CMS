from rest_framework import serializers
from USERS.models import StoreUser

class UserSignupSerializer(serializers.ModelSerializer):
    # We explicitly tell Django that the password is 'write_only'.
    # This means a user can SEND it to sign up, but the API will never RETURN it if someone requests user data.
    #it means it will not return the password in the response from the databse when fetching the user data.
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = StoreUser
        # These are the exact fields React needs to send when signing up an employee
        fields = ['first_name', 'last_name', 'email', 'mobileno', 'address', 'store', 'password']
        
     # We override the default create() method to ensure the password is hashed before saving to the database 
     # and user details are validated before saving to the database.
    def create(self, validated_data):
        # 1. Pull the raw password out of the clean, validated data
        password = validated_data.pop('password')
        
        # 2. Create the user object in Python's memory (not in the database yet)
        user = StoreUser(**validated_data) #instead of firstname=validated_data['first_name'], last_name=validated_data['last_name'], etc... we use **validated_data
        
        # 3. CRITICAL: This encrypts (hashes) the password. Never skip this step!
        user.set_password(password)
        
        # 4. Save the user to the database. (This triggers our custom EMP001 logic we wrote earlier!)
        user.save()  #save() is a method in StoreUser model
        
        return user  # 5. It saves the user to the database and returns the user object to the react frontend.
       
        
        