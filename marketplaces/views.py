from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Marketplace
from .serializers import MarketplaceSerializer

# Create your views here.
class MarketplaceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # 1. Superusers and Managers see ALL marketplaces
        if user.is_superuser or user.is_manager:
            marketplaces = Marketplace.objects.all()
            
        # 2. Employees ONLY see marketplaces specifically assigned to them
        elif user.is_employee:
            marketplaces = user.marketplaces.all()
            
        # 3. Fallback
        else:
            marketplaces = Marketplace.objects.none()
        
        # Just like Items and Orders!
        serializer = MarketplaceSerializer(marketplaces, many=True)
        return Response(serializer.data)