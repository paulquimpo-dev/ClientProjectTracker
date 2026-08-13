from datetime import date

from django.core.management.base import BaseCommand

from projects.models import Project


SEED_PROJECTS = (
    {
        "client_name": "Bayanihan Retail Group",
        "project_name": "E-Commerce Storefront Redesign",
        "description": (
            "Redesign the online storefront and improve the mobile shopping "
            "experience."
        ),
        "status": Project.Status.IN_PROGRESS,
        "priority": Project.Priority.HIGH,
        "start_date": date(2026, 6, 1),
        "due_date": date(2026, 9, 15),
    },
    {
        "client_name": "Kapihan Collective",
        "project_name": "Online Ordering and Pickup System",
        "description": (
            "Build an online ordering system for advance pickup across multiple "
            "cafe branches."
        ),
        "status": Project.Status.PLANNING,
        "priority": Project.Priority.HIGH,
        "start_date": date(2026, 8, 15),
        "due_date": date(2026, 11, 30),
    },
    {
        "client_name": "Isla Verde Travel Services",
        "project_name": "Tour Booking Portal",
        "description": (
            "Create a booking portal for local tours, packages, and customer "
            "reservations."
        ),
        "status": Project.Status.IN_PROGRESS,
        "priority": Project.Priority.MEDIUM,
        "start_date": date(2026, 5, 10),
        "due_date": date(2026, 10, 20),
    },
    {
        "client_name": "North Luzon Fitness Hub",
        "project_name": "Membership Management App",
        "description": (
            "Develop a membership application for subscriptions, class "
            "schedules, and bookings."
        ),
        "status": Project.Status.ON_HOLD,
        "priority": Project.Priority.MEDIUM,
        "start_date": date(2026, 7, 1),
        "due_date": date(2026, 12, 15),
    },
    {
        "client_name": "Sinag Learning Center",
        "project_name": "Student Enrollment Portal",
        "description": (
            "Replace the manual enrollment process with an online student "
            "registration portal."
        ),
        "status": Project.Status.COMPLETED,
        "priority": Project.Priority.HIGH,
        "start_date": date(2026, 1, 15),
        "due_date": date(2026, 4, 30),
    },
    {
        "client_name": "Habi Creative Studio",
        "project_name": "Brand Portfolio Website",
        "description": (
            "Build a portfolio website showcasing branding, illustration, and "
            "design projects."
        ),
        "status": Project.Status.PLANNING,
        "priority": Project.Priority.LOW,
        "start_date": date(2026, 9, 1),
        "due_date": date(2026, 10, 31),
    },
)


class Command(BaseCommand):
    help = "Create or synchronize the local demonstration projects."

    def handle(self, *args, **options) -> None:
        created_count = 0
        updated_count = 0

        for seed in SEED_PROJECTS:
            lookup = {
                "client_name": seed["client_name"],
                "project_name": seed["project_name"],
            }
            defaults = {
                key: value for key, value in seed.items() if key not in lookup
            }
            project, created = Project.objects.get_or_create(
                **lookup, defaults=defaults
            )

            if created:
                created_count += 1
                continue

            changed_fields = []
            for field, value in defaults.items():
                if getattr(project, field) != value:
                    setattr(project, field, value)
                    changed_fields.append(field)

            if changed_fields:
                project.save(update_fields=[*changed_fields, "updated_at"])
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Project seed complete: {created_count} created, "
                f"{updated_count} updated."
            )
        )
