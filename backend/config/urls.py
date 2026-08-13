"""Root URL configuration for the Client Project Tracker API."""

from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from authentication.views import csrf, login, logout, session
from projects.views import ProjectViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/csrf/", csrf, name="csrf"),
    path("auth/login/", login, name="login"),
    path("auth/logout/", logout, name="logout"),
    path("auth/session/", session, name="session"),
    path("", include(router.urls)),
]
