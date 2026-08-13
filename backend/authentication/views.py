import json
import logging

from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.http import HttpRequest, JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .throttling import clear_failed_logins, is_login_throttled, record_failed_login

logger = logging.getLogger(__name__)


def user_payload(user) -> dict[str, int | str]:
    return {"id": user.pk, "username": user.get_username()}


@ensure_csrf_cookie
@require_GET
def csrf(request: HttpRequest) -> JsonResponse:
    """Set a CSRF cookie for the browser before a state-changing request."""
    return JsonResponse({"csrfToken": get_token(request)})


@csrf_protect
@require_POST
def login(request: HttpRequest) -> JsonResponse:
    try:
        payload = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"detail": "Invalid sign-in request."}, status=400)

    username = payload.get("username", "") if isinstance(payload, dict) else ""
    password = payload.get("password", "") if isinstance(payload, dict) else ""
    if not isinstance(username, str) or not isinstance(password, str):
        return JsonResponse({"detail": "Invalid username or password."}, status=400)

    normalized_username = username.strip()
    if is_login_throttled(request, normalized_username):
        logger.warning("Login throttled", extra={"client_ip": request.META.get("REMOTE_ADDR", "unknown")})
        return JsonResponse(
            {"detail": "Too many sign-in attempts. Please wait before trying again."},
            status=429,
        )

    user = authenticate(request, username=normalized_username, password=password)
    if user is None:
        record_failed_login(request, normalized_username)
        logger.info("Login failed", extra={"client_ip": request.META.get("REMOTE_ADDR", "unknown")})
        return JsonResponse({"detail": "Invalid username or password."}, status=401)

    django_login(request, user)
    clear_failed_logins(request, normalized_username)
    logger.info("Login succeeded", extra={"client_ip": request.META.get("REMOTE_ADDR", "unknown")})
    return JsonResponse({"user": user_payload(user)})


@csrf_protect
@require_POST
def logout(request: HttpRequest) -> JsonResponse:
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Authentication credentials were not provided."}, status=401)

    django_logout(request)
    logger.info("Logout succeeded", extra={"client_ip": request.META.get("REMOTE_ADDR", "unknown")})
    return JsonResponse({}, status=204)


@require_GET
def session(request: HttpRequest) -> JsonResponse:
    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False})

    return JsonResponse({"authenticated": True, "user": user_payload(request.user)})


def csrf_failure(request: HttpRequest, reason: str = "") -> JsonResponse:
    """Return a safe API error without exposing Django's CSRF diagnostics."""
    logger.warning("CSRF verification failed", extra={"client_ip": request.META.get("REMOTE_ADDR", "unknown")})
    return JsonResponse({"detail": "This action could not be verified. Refresh the page and try again."}, status=403)
