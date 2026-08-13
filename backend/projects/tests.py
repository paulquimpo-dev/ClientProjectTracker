from datetime import date

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from .models import Project


class ProjectAPITests(APITestCase):
    def setUp(self) -> None:
        self.user = get_user_model().objects.create_user(
            username="project-manager", password="correct-horse-battery-staple"
        )
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
        self.client.force_authenticate(user=self.user)

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


class AuthenticationAPITests(APITestCase):
    def setUp(self) -> None:
        cache.clear()
        self.password = "correct-horse-battery-staple"
        self.user = get_user_model().objects.create_user(
            username="project-manager", password=self.password
        )
        self.csrf_client = APIClient(enforce_csrf_checks=True)

    def csrf_headers(self) -> dict[str, str]:
        response = self.csrf_client.get(reverse("csrf"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return {"HTTP_X_CSRFTOKEN": self.csrf_client.cookies["csrftoken"].value}

    def test_projects_require_authentication(self) -> None:
        response = self.client.get(reverse("project-list"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_session_reports_anonymous_user(self) -> None:
        response = self.client.get(reverse("session"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"authenticated": False})

    def test_login_requires_csrf_token(self) -> None:
        response = self.csrf_client.post(
            reverse("login"),
            {"username": self.user.username, "password": self.password},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json()["detail"],
            "This action could not be verified. Refresh the page and try again.",
        )

    def test_login_session_and_logout_flow(self) -> None:
        response = self.csrf_client.post(
            reverse("login"),
            {"username": self.user.username, "password": self.password},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["user"]["username"], self.user.username)

        session_response = self.csrf_client.get(reverse("session"))
        self.assertEqual(session_response.json()["authenticated"], True)

        logout_response = self.csrf_client.post(reverse("logout"), **self.csrf_headers())
        self.assertEqual(logout_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.csrf_client.get(reverse("session")).json(), {"authenticated": False})

    def test_login_rejects_invalid_credentials(self) -> None:
        response = self.csrf_client.post(
            reverse("login"),
            {"username": self.user.username, "password": "incorrect-password"},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json()["detail"], "Invalid username or password.")

    def test_login_throttles_repeated_failed_attempts(self) -> None:
        headers = self.csrf_headers()
        for _ in range(5):
            response = self.csrf_client.post(
                reverse("login"),
                {"username": self.user.username, "password": "incorrect-password"},
                format="json",
                **headers,
            )
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.csrf_client.post(
            reverse("login"),
            {"username": self.user.username, "password": "incorrect-password"},
            format="json",
            **headers,
        )

        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertEqual(
            response.json()["detail"], "Too many sign-in attempts. Please wait before trying again."
        )

    def test_cors_allows_only_the_configured_frontend_origin(self) -> None:
        allowed = self.client.get(reverse("session"), HTTP_ORIGIN="http://127.0.0.1:5173")
        untrusted = self.client.get(reverse("session"), HTTP_ORIGIN="https://untrusted.example")

        self.assertEqual(allowed.headers.get("access-control-allow-origin"), "http://127.0.0.1:5173")
        self.assertIsNone(untrusted.headers.get("access-control-allow-origin"))
