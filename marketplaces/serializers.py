from rest_framework import serializers
from .models import Marketplace

class MarketplaceSerializer(serializers.ModelSerializer):
    # This automatically formats the created_at date to YYYY-MM-DD and renames it to 'added_on'
    added_on = serializers.DateTimeField(source='created_at', format='%Y-%m-%d', read_only=True)

    class Meta:
        model = Marketplace
        fields = ['m_id', 'name', 'added_on']