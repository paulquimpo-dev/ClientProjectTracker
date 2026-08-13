# API Manual Testing Guide

Use this guide to verify the protected project API with curl or Postman. Project endpoints require an authenticated Django session and CSRF protection for state-changing requests.

## Before testing

Create a regular local user once, then start Django:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py shell
```

```python
from getpass import getpass
from django.contrib.auth import get_user_model

User = get_user_model()
User.objects.create_user(username=input("Username: ").strip(), password=getpass("Password: "))
exit()
```

```powershell
python manage.py runserver
```

Keep the server terminal open. The project API is `http://127.0.0.1:8000/projects/`.

## curl tests

The examples use `curl.exe` and a temporary cookie jar. Replace `project-manager` and `your-password` with the regular account created above.

```powershell
$cookieJar = Join-Path $env:TEMP 'client-project-tracker-cookies.txt'
Remove-Item $cookieJar -ErrorAction Ignore

function Get-CsrfToken {
  param([string]$CookieJar)
  $cookieLine = Get-Content $CookieJar | Where-Object { $_ -match '(^|\t)csrftoken\t' } | Select-Object -Last 1
  return ($cookieLine -split "`t")[-1]
}
```

### 1. Verify anonymous access is denied

```powershell
curl.exe -i http://127.0.0.1:8000/projects/
```

Expected: `401 Unauthorized`.

### 2. Obtain a CSRF cookie and sign in

```powershell
curl.exe -i -c $cookieJar http://127.0.0.1:8000/auth/csrf/
$csrfToken = Get-CsrfToken $cookieJar

@'
{"username":"project-manager","password":"your-password"}
'@ | curl.exe -i -b $cookieJar -c $cookieJar -X POST http://127.0.0.1:8000/auth/login/ -H "Content-Type: application/json" -H "X-CSRFToken: $csrfToken" --data-binary "@-"

$csrfToken = Get-CsrfToken $cookieJar
```

Expected: `200 OK` and the signed-in user's ID and username. Do not commit, share, or save the cookie jar.

### 3. List projects

```powershell
curl.exe -i -b $cookieJar http://127.0.0.1:8000/projects/
```

Expected: `200 OK` and a JSON array.

### 4. Create a valid project

```powershell
@'
{"clientName":"Mabuhay Digital Solutions","projectName":"Customer Support Portal","description":"Build a customer support portal for service requests and status tracking.","status":"Planning","priority":"High","startDate":"2026-08-20","dueDate":"2026-10-15"}
'@ | curl.exe -i -b $cookieJar -X POST http://127.0.0.1:8000/projects/ -H "Content-Type: application/json" -H "X-CSRFToken: $csrfToken" --data-binary "@-"
```

Expected: `201 Created`. Record the returned numeric `id` and use it below.

### 5. Reject invalid data

```powershell
@'
{"clientName":" ","projectName":"Invalid Portal","description":"This record should be rejected.","status":"Planning","priority":"High","startDate":"2026-10-15","dueDate":"2026-08-20"}
'@ | curl.exe -i -b $cookieJar -X POST http://127.0.0.1:8000/projects/ -H "Content-Type: application/json" -H "X-CSRFToken: $csrfToken" --data-binary "@-"
```

Expected: `400 Bad Request` with meaningful `clientName` and/or `dueDate` errors.

### 6. Update and delete a project

Replace `1` with the created project ID.

```powershell
@'
{"clientName":"Mabuhay Digital Solutions","projectName":"Updated Customer Support Portal","description":"Expanded scope.","status":"In Progress","priority":"Medium","startDate":"2026-08-20","dueDate":"2026-10-15"}
'@ | curl.exe -i -b $cookieJar -X PUT http://127.0.0.1:8000/projects/1/ -H "Content-Type: application/json" -H "X-CSRFToken: $csrfToken" --data-binary "@-"

curl.exe -i -b $cookieJar -X DELETE http://127.0.0.1:8000/projects/1/ -H "X-CSRFToken: $csrfToken"
```

Expected: `200 OK` for the update and `204 No Content` for deletion.

### 7. Sign out and clean up

```powershell
curl.exe -i -b $cookieJar -X POST http://127.0.0.1:8000/auth/logout/ -H "X-CSRFToken: $csrfToken"
Remove-Item $cookieJar -ErrorAction Ignore
```

Expected: `204 No Content`. A subsequent request to `/projects/` should again return `401 Unauthorized`.

## Postman tests

1. Send `GET http://127.0.0.1:8000/auth/csrf/` first; Postman stores the `csrftoken` cookie.
2. Send `POST http://127.0.0.1:8000/auth/login/` with JSON credentials and header `X-CSRFToken` set to the `csrftoken` cookie value.
3. For `POST`, `PUT`, `DELETE`, send the session cookies and the current `X-CSRFToken` header. Postman manages cookies automatically for the same host.
4. Verify `GET /projects/` is `401` before login, `200` after login, and `401` again after `POST /auth/logout/`.

Never place a real password, session cookie, or CSRF token in a saved collection or repository file.
