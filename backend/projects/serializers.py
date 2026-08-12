from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    clientName = serializers.CharField(
        source="client_name", max_length=255, allow_blank=True, trim_whitespace=False
    )
    projectName = serializers.CharField(
        source="project_name", max_length=255, allow_blank=True, trim_whitespace=False
    )
    startDate = serializers.DateField(source="start_date")
    dueDate = serializers.DateField(source="due_date")

    class Meta:
        model = Project
        fields = (
            "id",
            "clientName",
            "projectName",
            "description",
            "status",
            "priority",
            "startDate",
            "dueDate",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_clientName(self, value: str) -> str:
        return self._validate_required_text(value, "Client name")

    def validate_projectName(self, value: str) -> str:
        return self._validate_required_text(value, "Project name")

    def validate_description(self, value: str) -> str:
        return value.strip()

    def validate(self, attrs: dict) -> dict:
        start_date = attrs.get("start_date", getattr(self.instance, "start_date", None))
        due_date = attrs.get("due_date", getattr(self.instance, "due_date", None))

        if start_date and due_date and due_date < start_date:
            raise serializers.ValidationError(
                {"dueDate": "Due date cannot be earlier than start date."}
            )

        return attrs

    @staticmethod
    def _validate_required_text(value: str, field_label: str) -> str:
        trimmed_value = value.strip()
        if not trimmed_value:
            raise serializers.ValidationError(f"{field_label} cannot be blank.")
        return trimmed_value
