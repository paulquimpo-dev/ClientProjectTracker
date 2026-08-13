from datetime import date

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Project


class ProjectAPITests(APITestCase):
    def setUp(self) -> None:
        self.project = Project.objects.create(
            client_name="Acme Corporation",
            project_name="Website Redesign",
            description="Refresh the public website.",
            status=Project.Status.PLANNING,
            priority=Project.Priority.HIGH,
            start_date=date(2026, 8, 20),
            due_date=date(2026, 10, 15),
        )
        self.list_url = reverse("project-list")
        self.detail_url = reverse("project-detail", args=[self.project.pk])

    def test_required_project_routes_are_primary_api_contract(self) -> None:
        self.assertEqual(self.list_url, "/projects/")
        self.assertEqual(self.detail_url, f"/projects/{self.project.pk}/")

    def valid_payload(self) -> dict:
        return {
            "clientName": "Globex Corporation",
            "projectName": "Client Portal",
            "description": "Build a self-service portal.",
            "status": "In Progress",
            "priority": "Medium",
            "startDate": "2026-09-01",
            "dueDate": "2026-11-30",
        }

    def test_list_projects(self) -> None:
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["clientName"], "Acme Corporation")
        self.assertNotIn("client_name", response.data[0])

    def test_retrieve_existing_project(self) -> None:
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.project.pk)

    def test_retrieve_missing_project_returns_404(self) -> None:
        response = self.client.get(reverse("project-detail", args=[999999]))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_valid_project(self) -> None:
        response = self.client.post(self.list_url, self.valid_payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)
        created = Project.objects.get(pk=response.data["id"])
        self.assertEqual(created.client_name, "Globex Corporation")
        self.assertEqual(response.data["projectName"], "Client Portal")

    def test_create_invalid_project_returns_field_errors(self) -> None:
        payload = self.valid_payload()
        payload["clientName"] = "   "

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("clientName", response.data)
        self.assertEqual(Project.objects.count(), 1)

    def test_create_without_project_name_returns_field_error(self) -> None:
        payload = self.valid_payload()
        payload.pop("projectName")

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("projectName", response.data)
        self.assertEqual(Project.objects.count(), 1)

    def test_create_with_invalid_status_returns_field_error(self) -> None:
        payload = self.valid_payload()
        payload["status"] = "Cancelled"

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("status", response.data)
        self.assertEqual(Project.objects.count(), 1)

    def test_create_with_invalid_priority_returns_field_error(self) -> None:
        payload = self.valid_payload()
        payload["priority"] = "Urgent"

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("priority", response.data)
        self.assertEqual(Project.objects.count(), 1)

    def test_create_with_invalid_date_range_returns_due_date_error(self) -> None:
        payload = self.valid_payload()
        payload["dueDate"] = "2026-08-01"

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("dueDate", response.data)
        self.assertEqual(Project.objects.count(), 1)

    def test_update_project(self) -> None:
        payload = self.valid_payload()
        payload["projectName"] = "Updated Client Portal"

        response = self.client.put(self.detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.project_name, "Updated Client Portal")

    def test_delete_project(self) -> None:
        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(pk=self.project.pk).exists())

    def test_update_missing_project_returns_404(self) -> None:
        response = self.client.put(
            reverse("project-detail", args=[999999]),
            self.valid_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_missing_project_returns_404(self) -> None:
        response = self.client.delete(reverse("project-detail", args=[999999]))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
