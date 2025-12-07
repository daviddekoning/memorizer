from rest_framework import serializers
from .models import Verse


class VerseSerializer(serializers.ModelSerializer):
    """Serializer for Verse model."""
    
    class Meta:
        model = Verse
        fields = [
            'id',
            'reference',
            'translation',
            'text_content',
            'status',
            'hidden_indices',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_hidden_indices(self, value):
        """Ensure hidden_indices is a list of integers."""
        if not isinstance(value, list):
            raise serializers.ValidationError("hidden_indices must be a list")
        if not all(isinstance(i, int) for i in value):
            raise serializers.ValidationError("All items in hidden_indices must be integers")
        return value
