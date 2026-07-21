from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Marketplace
# Create your views here.
class MarketplaceListView(APIView):
    # The Bouncer: Only logged-in employees can see the business platforms
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. Ask the database for every marketplace that exists
        marketplaces = Marketplace.objects.all()
        
        #If the database is empty, return an empty dictionary
        # 2. Package the database objects into a dictionary
        data = [{
                "m_id": mp.m_id,
                "name": mp.name,
                # We can even format the date nicely before sending it to React
                "added_on": mp.created_at.strftime("%Y-%m-%d") if mp.created_at else None 
            } 
            for mp in marketplaces
        ]
        #return it to the react
        return Response(data)