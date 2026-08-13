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
{"clientName":"Mabuhay Digital Solutions","projectName":"Customer Support Portal","description":"Build a customer support portal for service requests and status tracking.","status":"Planning","priority":"High","startDate":"2026-08-20","dueDate":"2026-10-15"}
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
{"clientName":" ","projectName":"Invalid Support Portal","description":"This temporary record should be rejected.","status":"Planning","priority":"High","startDate":"2026-08-20","dueDate":"2026-10-15"}
'@ | curl.exe -i -X POST http://127.0.0.1:8000/api/projects/ -H "Content-Type: application/json" --data-binary "@-"
```

Expected: `400 Bad Request` with a `clientName` validation error.

To test the date rule independently, use a valid client name:

```powershell
@'
{"clientName":"Mabuhay Digital Solutions","projectName":"Invalid Portal Schedule","description":"This temporary record has an invalid date range.","status":"Planning","priority":"High","startDate":"2026-10-15","dueDate":"2026-08-20"}
'@ | curl.exe -i -X POST http://127.0.0.1:8000/api/projects/ -H "Content-Type: application/json" --data-binary "@-"
```

Expected: `400 Bad Request` with a `dueDate` validation error.

### 5. Update the project

```powershell
@'
{"clientName":"Mabuhay Digital Solutions","projectName":"Updated Customer Support Portal","description":"Expand the portal scope to include service requests and status notifications.","status":"In Progress","priority":"Medium","startDate":"2026-08-20","dueDate":"2026-10-15"}
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

Use this base URL:

```text
http://127.0.0.1:8000/api/projects/
```

For requests with a body, select **Body > raw > JSON**. Postman should automatically set `Content-Type: application/json`.

### 1. List projects

- Method: `GET`
- URL: `http://127.0.0.1:8000/api/projects/`
- Body: none
- Expected: `200 OK` and a JSON array

### 2. Create a valid project

- Method: `POST`
- URL: `http://127.0.0.1:8000/api/projects/`
- Body:

```json
{
  "clientName": "Mabuhay Digital Solutions",
  "projectName": "Customer Support Portal",
  "description": "Build a customer support portal for service requests and status tracking.",
  "status": "Planning",
  "priority": "High",
  "startDate": "2026-08-20",
  "dueDate": "2026-10-15"
}
```

Expected: `201 Created`. Save the returned numeric `id` and use it instead of `{id}` in the retrieve, update, and delete requests.

### 3. Retrieve the created project

- Method: `GET`
- URL: `http://127.0.0.1:8000/api/projects/{id}/`
- Body: none
- Expected: `200 OK`

For example, if creation returned `"id": 12`, use:

```text
http://127.0.0.1:8000/api/projects/12/
```

### 4. Reject a blank client name

- Method: `POST`
- URL: `http://127.0.0.1:8000/api/projects/`
- Body:

```json
{
  "clientName": " ",
  "projectName": "Invalid Support Portal",
  "description": "This temporary record should be rejected.",
  "status": "Planning",
  "priority": "High",
  "startDate": "2026-08-20",
  "dueDate": "2026-10-15"
}
```

Expected: `400 Bad Request` with a `clientName` error.

### 5. Reject an invalid date range

- Method: `POST`
- URL: `http://127.0.0.1:8000/api/projects/`
- Body:

```json
{
  "clientName": "Mabuhay Digital Solutions",
  "projectName": "Invalid Portal Schedule",
  "description": "This temporary record has an invalid date range.",
  "status": "Planning",
  "priority": "High",
  "startDate": "2026-10-15",
  "dueDate": "2026-08-20"
}
```

Expected: `400 Bad Request` with a `dueDate` error.

### 6. Update the created project

- Method: `PUT`
- URL: `http://127.0.0.1:8000/api/projects/{id}/`
- Body:

```json
{
  "clientName": "Mabuhay Digital Solutions",
  "projectName": "Updated Customer Support Portal",
  "description": "Expand the portal scope to include service requests and status notifications.",
  "status": "In Progress",
  "priority": "Medium",
  "startDate": "2026-08-20",
  "dueDate": "2026-10-15"
}
```

Expected: `200 OK` with the updated project. Send another `GET` request for the same ID to confirm that the changes persisted.

### 7. Retrieve a missing project

- Method: `GET`
- URL: `http://127.0.0.1:8000/api/projects/999999/`
- Body: none
- Expected: `404 Not Found`

### 8. Delete the created project

- Method: `DELETE`
- URL: `http://127.0.0.1:8000/api/projects/{id}/`
- Body: none
- Expected: `204 No Content`

Send a `GET` request for the deleted ID afterward. It should return `404 Not Found`.

### Postman summary

| Test | Method | URL | Expected status |
| --- | --- | --- | --- |
| List | `GET` | `/api/projects/` | `200` |
| Create valid | `POST` | `/api/projects/` | `201` |
| Create invalid | `POST` | `/api/projects/` | `400` |
| Retrieve existing | `GET` | `/api/projects/{id}/` | `200` |
| Update | `PUT` | `/api/projects/{id}/` | `200` |
| Retrieve missing | `GET` | `/api/projects/999999/` | `404` |
| Delete | `DELETE` | `/api/projects/{id}/` | `204` |

Do not type `{id}` literally. Replace it with the numeric ID returned by the valid create request.
