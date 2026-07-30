from django.shortcuts import render
from .serializers import UserSignupSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class SignupView(APIView):
    # This tells Django to only run this code if the frontend is making a POST request
    def post(self, request):
        
        # 1. Take the raw JSON data from the request and give it to our translator (Serializer)
        serializer = UserSignupSerializer(data=request.data)
        
        # 2. Ask the serializer to check the data against all our database rules
        
        if serializer.is_valid():
            # 3. If valid, this triggers the custom `create` method in serializers.py
            # It hashes the password, generates the EMP001 ID, and saves to MySQL.
            serializer.save()
            # 4. Send a success message and a "201 Created" status code back to React
            return Response({"message": "Employee account created successfully!",
                            "user": serializer.data}, 
                            status = status.HTTP_201_CREATED)
        # 5. If the data failed validation, send a "400 Bad Request" and the exact errors 
        # (like "email already exists") back to the frontend.
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
#sending the user details to the profile page after successful login
class UserProfileView(APIView):
    # THE BOUNCER: This single line tells Django, "Do not let anyone run the code below unless they provided a valid JWT token!"
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        # THE DATA FLOW: Because the user passed the security check, 
        # Django automatically figures out exactly who they are and attaches their database row to 'request.user'
        user = request.user  #here, user is the user who is currently logged in and has a valid JWT token. It is an instance of StoreUser model. 
        
        # 1. FETCHING THE STORE
        # A user might not be assigned a store yet, so we safely check if it exists.
        store_data = None
        if user.store:
            store_data = {
                # Update these field names if your Store model uses different ones!
                "id": user.store.pk,
                "name": str(user.store) # This calls the __str__ method of your Store model
            }
            
        # 2. FETCHING THE MARKETPLACES
        # user.marketplaces.all() looks inside the hidden mapping table and grabs all linked platforms.
        # We use a list comprehension to pack them into a clean dictionary list.
        marketplaces_data = []

        for mp in user.marketplaces.all():
            marketplaces_data.append({
                "m_id": mp.m_id,
                "name": mp.name
            })    
        # We package their private data into a dictionary and send it back as JSON
        return Response({
            "employee_id": user.user_id,
            "full_name": user.first_name + ' '+ user.last_name,
            "email": user.email,
            "store": store_data["name"] if store_data else "No Store Assigned",
            "store_id" : store_data["id"],
            "address": user.address
        })