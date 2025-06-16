# API Routes Documentation

This document describes the available API endpoints, their request formats, and expected responses for the backend in [src/Routes/file_route.js](src/Routes/file_route.js).

---

## 1. Upload a File

**Endpoint:**  
`POST /api/`

**Description:**  
Uploads a single file (image) and saves its Cloudinary link and metadata.

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `image`: File (required)
  - `name`: String (required)

**Response:**

- Success (`200 OK`)
  ```json
  {
    "success": true,
    "msg": "file uploaded",
    "link": "https://res.cloudinary.com/..."
  }
  ```
- Failure (`400` or `500`)
  ```json
  {
    "success": false,
    "msg": "Something went wrong",
    "error": "Error message"
  }
  ```

---

## 2. Delete a File Record

**Endpoint:**  
`GET /api/deleterecord`

**Description:**  
Deletes a file record by name from both Cloudinary and the database.

**Request:**

- Body (JSON):
  - `name`: String (required)

**Response:**

- Success (`200 OK`)
  ```json
  {
    "message": "record deleted from database",
    "data": {
      /* deleted record object */
    }
  }
  ```
- Failure (`400`)
  ```json
  {
    "message": "please provide name"
  }
  ```

---

## 3. Upload Profile Data

**Endpoint:**  
`POST /api/profile`

**Description:**  
Uploads avatar, video, and PDF files for a profile, saves their Cloudinary links and metadata.

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `avatar`: File (required)
  - `video`: File (required)
  - `pdf`: File (required)
  - `name`: String (required)

**Response:**

- Success (`200 OK`)
  ```json
  {
    "upload_links": [
      "https://res.cloudinary.com/.../avatar.jpg",
      "https://res.cloudinary.com/.../video.mp4",
      "https://res.cloudinary.com/.../file.pdf"
    ],
    "profile": {
      /* created profile object */
    }
  }
  ```
- Failure (`400` or `500`)
  ```json
  {
    "message": "Please upload all files"
  }
  ```

---

## 4. Delete Profile

**Endpoint:**  
`GET /api/deleteprofile`

**Description:**  
Deletes a profile and its associated files from Cloudinary and the database.

**Request:**

- Body (JSON):
  - `name`: String (required)

**Response:**

- Success (`200 OK`)
  ```json
  {
    "message": "profile deleted"
  }
  ```
- Failure (`404`)
  ```json
  {
    "message": "Profile not found"
  }
  ```

---

## 5. Update Profile Avatar

**Endpoint:**  
`POST /api/updateprofile`

**Description:**  
Updates the avatar image for a profile.

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `avatar`: File (required)
  - `name`: String (required)

**Response:**

- Success (`200 OK`)
  ```json
  {
    "message": "avatar updated"
  }
  ```
- Failure (`404` or `500`)
  ```json
  {
    "message": "Profile not found"
  }
  ```

---

## Notes

- All endpoints are prefixed with `/api`.
- File uploads must use `multipart/form-data`.
- For GET requests that require a body, use a tool like Postman or send JSON in the request body (not standard for GET, consider changing to POST for better REST compliance).
- Error messages and status codes may vary depending on validation and server errors.

---

For more details, see the route implementations in [src/Routes/file_route.js](src/Routes/file_route.js) and controller logic in [src/controller/fileController.js](src/controller/fileController.js).
