from hashlib import sha256

from django.core.cache import cache
from django.http import HttpRequest

MAXIMUM_FAILURES = 5
WINDOW_SECONDS = 15 * 60


def is_login_throttled(request: HttpRequest, username: str) -> bool:
    return int(cache.get(_cache_key(request, username), 0)) >= MAXIMUM_FAILURES


def record_failed_login(request: HttpRequest, username: str) -> None:
    key = _cache_key(request, username)
    attempts = int(cache.get(key, 0)) + 1
    cache.set(key, attempts, timeout=WINDOW_SECONDS)


def clear_failed_logins(request: HttpRequest, username: str) -> None:
    cache.delete(_cache_key(request, username))


def _cache_key(request: HttpRequest, username: str) -> str:
    client_address = request.META.get("REMOTE_ADDR", "unknown")
    digest = sha256(f"{client_address}:{username.casefold()}".encode()).hexdigest()
    return f"authentication:login-attempts:{digest}"
