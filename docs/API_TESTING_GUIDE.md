# API Manual Testing Guide

Use this guide to verify the Phase 4 CRUD API with curl or Postman.

## Before testing

Activate the backend environment and start Django:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
```

Keep that terminal open. The base API URL is:

```text
http://127.0.0.1:8000/api/projects/
```

Use a second terminal for curl, or open Postman. No authentication is currently required.

## curl tests

The examples below use `curl.exe`, which avoids PowerShell's `curl` alias behavior. JSON request bodies are piped through standard input so PowerShell does not remove their quotation marks.

### 1. List projects

```powershell
curl.exe -i http://127.0.0.1:8000/api/projects/
```

Expected: `200 OK` and a JSON array. An empty database returns `[]`.

### 2. Create a valid project

```powershell
@'
{"clientName":"Acme Corporation","projectName":"Website Redesign","description":"Refresh the public website.","status":"Planning","priority":"High","startDate":"2026-08-20","dueDate":"2026-10-15"}
'@ | curl.exe -i -X POST http://127.0.0.1:8000/api/projects/ -H "Content-Type: application/json" --data-binary "@-"
```

Expected: `201 Created`. Note the returned `id`; the following examples use `1`. Replace it if your returned ID is different.

### 3. Retrieve the project

```powershell
curl.exe -i http://127.0.0.1:8000/api/projects/1/
```

Expected: `200 OK` and the created project.

### 4. Reject invalid data

```powershell
@'
{"clientName":" ","projectName":"Invalid Project","status":"Planning","priority":"High","startDate":"2026-10-15","dueDate":"2026-08-20"}
'@ | curl.exe -i -X POST http://127.0.0.1:8000/api/projects/ -H "Content-Type: application/json" --data-binary "@-"
```

Expected: `400 Bad Request` with a `clientName` validation error.

To test the date rule independently, use a valid client name:

```powershell
@'
{"clientName":"Acme Corporation","projectName":"Invalid Dates","status":"Planning","priority":"High","startDate":"2026-10-15","dueDate":"2026-08-20"}
'@ | curl.exe -i -X POST http://127.0.0.1:8000/api/projects/ -H "Content-Type: application/json" --data-binary "@-"
```

Expected: `400 Bad Request` with a `dueDate` validation error.

### 5. Update the project

```powershell
@'
{"clientName":"Acme Corporation","projectName":"Updated Website Redesign","description":"Updated scope.","status":"In Progress","priority":"Medium","startDate":"2026-08-20","dueDate":"2026-10-15"}
'@ | curl.exe -i -X PUT http://127.0.0.1:8000/api/projects/1/ -H "Content-Type: application/json" --data-binary "@-"
```

Expected: `200 OK`. Retrieve the project again to confirm that the changes persisted.

### 6. Retrieve a missing project

```powershell
curl.exe -i http://127.0.0.1:8000/api/projects/999999/
```

Expected: `404 Not Found`.

### 7. Delete the project

```powershell
curl.exe -i -X DELETE http://127.0.0.1:8000/api/projects/1/
```

Expected: `204 No Content`. Retrieving the same ID afterward should return `404 Not Found`.

## Postman tests

For each request, select the method, enter the URL, and click **Send**. For `POST` and `PUT`, select **Body > raw > JSON** and use the JSON payloads from the curl examples.

| Test | Method | URL | Expected status |
| --- | --- | --- | --- |
| List | `GET` | `/api/projects/` | `200` |
| Create valid | `POST` | `/api/projects/` | `201` |
| Create invalid | `POST` | `/api/projects/` | `400` |
| Retrieve existing | `GET` | `/api/projects/{id}/` | `200` |
| Update | `PUT` | `/api/projects/{id}/` | `200` |
| Retrieve missing | `GET` | `/api/projects/999999/` | `404` |
| Delete | `DELETE` | `/api/projects/{id}/` | `204` |

Postman usually sets `Content-Type: application/json` automatically when **JSON** is selected. Confirm that updates appear in a later `GET` response and deletions produce a later `404`.
