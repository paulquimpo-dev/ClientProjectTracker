"""Root URL configuration for the Client Project Tracker API."""

from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from projects.views import ProjectViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
