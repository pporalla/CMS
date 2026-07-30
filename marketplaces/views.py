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
        
        if user.is_superuser or user.is_manager:
            marketplaces = Marketplace.objects.all()
            
        elif user.is_employee:
            marketplaces = user.marketplaces.all()
            
        else:
            marketplaces = Marketplace.objects.none()
        
        serializer = MarketplaceSerializer(marketplaces, many=True)
        return Response(serializer.data)