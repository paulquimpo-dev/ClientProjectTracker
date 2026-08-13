from datetime import date
from io import StringIO

from django.core.management import call_command
from django.test import TestCase

from .management.commands.seed_projects import SEED_PROJECTS
from .models import Project


class SeedProjectsCommandTests(TestCase):
    def run_seed(self) -> str:
        output = StringIO()
        call_command("seed_projects", stdout=output)
        return output.getvalue()

    def test_seed_populates_clean_database(self) -> None:
        output = self.run_seed()

        self.assertEqual(Project.objects.count(), len(SEED_PROJECTS))
        self.assertIn("12 created, 0 updated", output)
        self.assertTrue(
            Project.objects.filter(
                client_name="Acme Corporation",
                project_name="Corporate Website Redesign",
            ).exists()
        )

    def test_seed_is_repeatable_without_duplicates(self) -> None:
        self.run_seed()

        output = self.run_seed()

        self.assertEqual(Project.objects.count(), len(SEED_PROJECTS))
        self.assertIn("0 created, 0 updated", output)

    def test_seed_synchronizes_changed_seed_record(self) -> None:
        self.run_seed()
        project = Project.objects.get(client_name="GreenLeaf Cafe")
        project.status = Project.Status.COMPLETED
        project.save()

        output = self.run_seed()

        project.refresh_from_db()
        self.assertEqual(project.status, Project.Status.PLANNING)
        self.assertIn("0 created, 1 updated", output)

    def test_seed_preserves_unrelated_project(self) -> None:
        Project.objects.create(
            client_name="Independent Client",
            project_name="Unrelated Project",
            status=Project.Status.PLANNING,
            priority=Project.Priority.LOW,
            start_date=date(2026, 1, 1),
            due_date=date(2026, 1, 31),
        )

        self.run_seed()

        self.assertTrue(
            Project.objects.filter(project_name="Unrelated Project").exists()
        )
