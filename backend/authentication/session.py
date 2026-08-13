from rest_framework.authentication import SessionAuthentication as DRFSessionAuthentication


class SessionAuthentication(DRFSessionAuthentication):
    """Return 401 for anonymous API requests while retaining Django CSRF checks."""

    def authenticate_header(self, request):
        return "Session"
