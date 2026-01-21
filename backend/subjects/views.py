from rest_framework import viewsets, permissions
from .models import Subject
from .serializers import SubjectSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    """
    Handles list, create, retrieve, update, and delete for Subjects.
    Ensures users only access their own subjects.
    """
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return subjects only for the logged-in user
        return Subject.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as owner
        serializer.save(owner=self.request.user)
