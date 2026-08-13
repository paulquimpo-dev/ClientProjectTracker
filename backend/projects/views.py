from rest_framework import viewsets

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """Provide the required CRUD operations for projects."""

    queryset = Project.objects.all().order_by("id")
    serializer_class = ProjectSerializer
