# API Testing Guide

Use this guide to manually verify authentication, CRUD, and validation with PowerShell `curl.exe`. The API requires a signed-in Django session and CSRF protection for `POST`, `PUT`, and `DELETE` requests.

## 1. Prepare the API

From `backend/`, activate the virtual environment, migrate the database, create a regular user if needed, and start the server. Full setup instructions are in the [root README](../README.md).

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
```

Keep the server running. The API base URL is `http://127.0.0.1:8000`.

## 2. Prepare a temporary cookie jar

Replace `project-manager` and `your-password` below with your regular account credentials.

```powershell
$cookieJar = Join-Path $env:TEMP 'client-project-tracker-cookies.txt'
Remove-Item $cookieJar -ErrorAction Ignore

function Get-CsrfToken {
  param([string]$CookieJar)
  $line = Get-Content $CookieJar | Where-Object { $_ -match '(^|\t)csrftoken\t' } | Select-Object -Last 1
  return ($line -split "`t")[-1]
}
```

## 3. Verify authentication

Anonymous project access must be denied:

```powershell
curl.exe -i http://127.0.0.1:8000/projects/
```

Expected: `401 Unauthorized`.

Obtain a CSRF cookie and sign in:

```powershell
curl.exe -c $cookieJar http://127.0.0.1:8000/auth/csrf/
$csrfToken = Get-CsrfToken $cookieJar

@'
{"username":"project-manager","password":"your-password"}
'@ | curl.exe -i -b $cookieJar -c $cookieJar -X POST http://127.0.0.1:8000/auth/login/ -H "Content-Type: application/json" -H "X-CSRFToken: $csrfToken" --data-binary "@-"

$csrfToken = Get-CsrfToken $cookieJar
```

Expected: `200 OK` and a user object.

## 4. Verify CRUD

List projects:

```powershell
curl.exe -i -b $cookieJar http://127.0.0.1:8000/projects/
```

Create a project and note the returned `id`:

```powershell
@'
{"clientName":"Demo Client","projectName":"Manual API Test","description":"Temporary verification record.","status":"Planning","priority":"High","startDate":"2026-08-20","dueDate":"2026-10-15"}
'@ | curl.exe -i -b $cookieJar -X POST http://127.0.0.1:8000/projects/ -H "Content-Type: application/json" -H "X-CSRFToken: $csrfToken" --data-binary "@-"
```

Replace `<id>` with that ID to retrieve, update, then delete the temporary project:

```powershell
curl.exe -i -b $cookieJar http://127.0.0.1:8000/projects/<id>/

@'
{"clientName":"Demo Client","projectName":"Updated Manual API Test","description":"Updated temporary record.","status":"In Progress","priority":"Medium","startDate":"2026-08-20","dueDate":"2026-10-15"}
'@ | curl.exe -i -b $cookieJar -X PUT http://127.0.0.1:8000/projects/<id>/ -H "Content-Type: application/json" -H "X-CSRFToken: $csrfToken" --data-binary "@-"

curl.exe -i -b $cookieJar -X DELETE http://127.0.0.1:8000/projects/<id>/ -H "X-CSRFToken: $csrfToken"
```

Expected: `200`, `201`, `200`, and `204` respectively.

## 5. Verify validation

```powershell
@'
{"clientName":" ","projectName":"Invalid Record","description":"This must fail.","status":"Planning","priority":"High","startDate":"2026-10-15","dueDate":"2026-08-20"}
'@ | curl.exe -i -b $cookieJar -X POST http://127.0.0.1:8000/projects/ -H "Content-Type: application/json" -H "X-CSRFToken: $csrfToken" --data-binary "@-"
```

Expected: `400 Bad Request` with meaningful `clientName` and/or `dueDate` errors.

## 6. Sign out and clean up

```powershell
curl.exe -i -b $cookieJar -X POST http://127.0.0.1:8000/auth/logout/ -H "X-CSRFToken: $csrfToken"
Remove-Item $cookieJar -ErrorAction Ignore
```

Expected: `204 No Content`. Never commit or share passwords, cookies, or CSRF tokens.
