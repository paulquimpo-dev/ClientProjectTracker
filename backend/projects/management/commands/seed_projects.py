from datetime import date

from django.core.management.base import BaseCommand

from projects.models import Project


SEED_PROJECTS = (
    {
        "client_name": "Acme Corporation",
        "project_name": "Corporate Website Redesign",
        "description": "Redesign and modernize the company's corporate website.",
        "status": Project.Status.IN_PROGRESS,
        "priority": Project.Priority.HIGH,
        "start_date": date(2026, 6, 1),
        "due_date": date(2026, 7, 15),
    },
    {
        "client_name": "GreenLeaf Cafe",
        "project_name": "Online Ordering System",
        "description": "Develop an online ordering platform for customers.",
        "status": Project.Status.PLANNING,
        "priority": Project.Priority.MEDIUM,
        "start_date": date(2026, 6, 10),
        "due_date": date(2026, 8, 1),
    },
    {
        "client_name": "Bright Realty",
        "project_name": "Property Listing Portal",
        "description": "Build a portal for managing property listings.",
        "status": Project.Status.ON_HOLD,
        "priority": Project.Priority.MEDIUM,
        "start_date": date(2026, 5, 15),
        "due_date": date(2026, 7, 30),
    },
    {
        "client_name": "Nova Fitness",
        "project_name": "Mobile App MVP",
        "description": "Develop the first version of the fitness tracking app.",
        "status": Project.Status.IN_PROGRESS,
        "priority": Project.Priority.HIGH,
        "start_date": date(2026, 6, 5),
        "due_date": date(2026, 8, 20),
    },
    {
        "client_name": "Blue Ocean Travel",
        "project_name": "Booking Platform Enhancement",
        "description": "Improve search and booking functionalities.",
        "status": Project.Status.COMPLETED,
        "priority": Project.Priority.MEDIUM,
        "start_date": date(2026, 4, 1),
        "due_date": date(2026, 5, 30),
    },
    {
        "client_name": "TechVision Solutions",
        "project_name": "CRM Dashboard",
        "description": "Develop an internal CRM dashboard.",
        "status": Project.Status.PLANNING,
        "priority": Project.Priority.HIGH,
        "start_date": date(2026, 6, 15),
        "due_date": date(2026, 8, 15),
    },
    {
        "client_name": "Urban Living",
        "project_name": "Property Management System",
        "description": "Create a platform for managing rental properties.",
        "status": Project.Status.IN_PROGRESS,
        "priority": Project.Priority.MEDIUM,
        "start_date": date(2026, 5, 20),
        "due_date": date(2026, 8, 10),
    },
    {
        "client_name": "Elite Events",
        "project_name": "Event Registration Portal",
        "description": "Develop a registration and ticketing portal.",
        "status": Project.Status.PLANNING,
        "priority": Project.Priority.LOW,
        "start_date": date(2026, 6, 20),
        "due_date": date(2026, 9, 1),
    },
    {
        "client_name": "HealthFirst Clinic",
        "project_name": "Patient Appointment System",
        "description": "Build an appointment scheduling application.",
        "status": Project.Status.COMPLETED,
        "priority": Project.Priority.HIGH,
        "start_date": date(2026, 3, 1),
        "due_date": date(2026, 5, 1),
    },
    {
        "client_name": "MarketPro",
        "project_name": "Marketing Campaign Dashboard",
        "description": "Track and manage digital marketing campaigns.",
        "status": Project.Status.IN_PROGRESS,
        "priority": Project.Priority.MEDIUM,
        "start_date": date(2026, 6, 1),
        "due_date": date(2026, 7, 31),
    },
    {
        "client_name": "Sunrise Education",
        "project_name": "Learning Management Portal",
        "description": "Develop a portal for students and instructors.",
        "status": Project.Status.PLANNING,
        "priority": Project.Priority.HIGH,
        "start_date": date(2026, 7, 1),
        "due_date": date(2026, 9, 30),
    },
    {
        "client_name": "FreshFarm",
        "project_name": "Inventory Management System",
        "description": "Track inventory across multiple locations.",
        "status": Project.Status.ON_HOLD,
        "priority": Project.Priority.LOW,
        "start_date": date(2026, 5, 1),
        "due_date": date(2026, 8, 1),
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
