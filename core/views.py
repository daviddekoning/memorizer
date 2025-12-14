from rest_framework import viewsets, permissions
from .models import Verse
from .serializers import VerseSerializer


class VerseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Bible verses.
    Only returns verses belonging to the authenticated user.
    """
    serializer_class = VerseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter verses to only show those belonging to the current user."""
        return Verse.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Set the user to the current user when creating a verse."""
        serializer.save(user=self.request.user)

