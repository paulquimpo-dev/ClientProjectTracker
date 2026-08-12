from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("project_name", "client_name", "status", "priority", "due_date")
    list_filter = ("status", "priority")
    search_fields = ("project_name", "client_name")
