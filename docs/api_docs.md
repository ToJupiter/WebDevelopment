# Comprehensive API Documentation for SkillSync Backend

## **Authentication**
All endpoints require authentication unless explicitly marked as public. Authentication is typically handled via JWT stored in cookies. 

Role Creator is obsolete and is deprecated now. We only have 2 roles now: admin and user. 

---

### **1. Authentication Endpoints**

#### **Register New User**
- **Endpoint**: `POST /api/auth/register`
- **Public**: Yes
- **Request Body**:
  ```json
  {
    "full_name": "string (min 3 chars, letters/spaces/hyphens/apostrophes only)",
    "email": "string (valid email format)",
    "password": "string (min 8 chars, must contain uppercase, lowercase, number, special character)"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "user_id": "uuid",
      "email": "string",
      "full_name": "string",
      "current_level": "beginner|intermediate|advanced",
      "role": "user|creator|admin",
      "avatar_url": "string|null",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `409 Conflict`: "An user with this email already exists."
  - `400 Bad Request`: Validation errors with field-specific messages
  - `500 Internal Server Error`

---

#### **Login User**
- **Endpoint**: `POST /api/auth/login`
- **Public**: Yes
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user_id": "uuid",
      "email": "string",
      "full_name": "string",
      "current_level": "beginner|intermediate|advanced",
      "role": "user|creator|admin",
      "avatar_url": "string|null",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
  *Sets `skillsync_token` cookie with JWT*
- **Error Responses**:
  - `401 Unauthorized`: "Invalid email or password"
  - `400 Bad Request`: Validation errors
  - `500 Internal Server Error`

---

#### **Logout User**
- **Endpoint**: `POST /api/auth/logout`
- **Public**: No (requires authentication)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Logged out successfully"
    },
    "error": null
  }
  ```
  *Clears `skillsync_token` cookie*
- **Error Responses**:
  - `500 Internal Server Error`

---

### **2. User Profile Endpoints**

#### **Get Current User Profile**
- **Endpoint**: `GET /api/users/me`
- **Authentication**: Required
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user_id": "uuid",
      "email": "string",
      "full_name": "string",
      "current_level": "beginner|intermediate|advanced",
      "role": "user|creator|admin",
      "avatar_url": "string|null",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Update User Profile**
- **Endpoint**: `PUT /api/users/me`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "full_name": "string (optional)",
    "avatar_url": "string (optional)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user_id": "uuid",
      "email": "string",
      "full_name": "string",
      "current_level": "beginner|intermediate|advanced",
      "role": "user|creator|admin",
      "avatar_url": "string|null",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Change Password**
- **Endpoint**: `PUT /api/users/me/password`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "old_password": "string",
    "new_password": "string (min 8 chars, must contain uppercase, lowercase, number, special character)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Password updated successfully"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: "Both old and new passwords are required" or "Incorrect old password"
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

### **3. Roadmap Management Endpoints**

#### **List Published Roadmaps (Public)**
- **Endpoint**: `GET /api/roadmaps`
- **Public**: Yes
- **Query Parameters**:
  - `category` (optional): Filter by category (e.g., "web-development")
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "roadmap_id": "uuid",
        "title": "string",
        "description": "string|null",
        "category": "string",
        "image_url": "string|null",
        "status": "draft|published",
        "created_at": "ISO datetime",
        "updated_at": "ISO datetime",
        "module_count": 0
      }
    ],
    "error": null
  }
  ```
- **Error Responses**:
  - `500 Internal Server Error`

---

#### **Get Roadmap Details (Public)**
- **Endpoint**: `GET /api/roadmaps/:roadmapId`
- **Public**: Yes
- **Path Parameters**:
  - `roadmapId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "roadmap_id": "uuid",
      "title": "string",
      "description": "string|null",
      "category": "string",
      "image_url": "string|null",
      "status": "draft|published",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime",
      "modules": [
        {
          "module_id": "uuid",
          "title": "string",
          "description": "string|null",
          "content": "string|null",
          "order_index": 0,
          "estimated_hours": 0.0,
          "created_at": "ISO datetime",
          "updated_at": "ISO datetime"
        }
      ]
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: "Invalid roadmap identifier"
  - `404 Not Found`: "Roadmap not found"
  - `500 Internal Server Error`

---

#### **List Enrolled Roadmaps**
- **Endpoint**: `GET /api/roadmaps/enrolled/list`
- **Authentication**: Required
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "roadmap_id": "uuid",
        "title": "string",
        "description": "string|null",
        "category": "string",
        "image_url": "string|null",
        "status": "draft|published",
        "created_at": "ISO datetime",
        "updated_at": "ISO datetime"
      }
    ],
    "error": null
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Enroll in Roadmap**
- **Endpoint**: `POST /api/roadmaps/:roadmapId/enroll`
- **Authentication**: Required
- **Path Parameters**:
  - `roadmapId`: Valid UUID string
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "roadmap_id": "uuid",
      "enrolled": 0
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: "Invalid roadmap identifier"
  - `401 Unauthorized`
  - `404 Not Found`: "Roadmap not found"
  - `500 Internal Server Error`

---

#### **Create Roadmap (Admin/Creator Only)**
- **Endpoint**: `POST /api/roadmaps`
- **Authentication**: Required (Admin/Creator)
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string (optional)",
    "category": "string",
    "image_url": "string (optional)"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "roadmap_id": "uuid",
      "title": "string",
      "description": "string|null",
      "category": "string",
      "image_url": "string|null",
      "created_by": "uuid",
      "status": "published",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions
  - `400 Bad Request`: "Title and Category are required"
  - `500 Internal Server Error`

---

#### **Update Roadmap (Admin/Creator Only)**
- **Endpoint**: `PUT /api/roadmaps/:roadmapId`
- **Authentication**: Required (Admin/Creator + Ownership)
- **Path Parameters**:
  - `roadmapId`: Valid UUID string
- **Request Body** (any combination of):
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "category": "string (optional)",
    "status": "draft|published (optional)",
    "image_url": "string (optional)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "roadmap_id": "uuid",
      "title": "string",
      "description": "string|null",
      "category": "string",
      "image_url": "string|null",
      "status": "draft|published",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions or not owner
  - `404 Not Found`
  - `500 Internal Server Error`

---

#### **Delete Roadmap (Admin/Creator Only)**
- **Endpoint**: `DELETE /api/roadmaps/:roadmapId`
- **Authentication**: Required (Admin/Creator + Ownership)
- **Path Parameters**:
  - `roadmapId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Roadmap deleted"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions or not owner
  - `404 Not Found`
  - `500 Internal Server Error`

---

#### **Create Module (Admin/Creator Only)**
- **Endpoint**: `POST /api/roadmaps/:roadmapId/modules`
- **Authentication**: Required (Admin/Creator + Roadmap Ownership)
- **Path Parameters**:
  - `roadmapId`: Valid UUID string
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string (optional)",
    "content": "string (optional, defaults to 'Placeholder content')",
    "order_index": "integer (optional, defaults to 1)",
    "estimated_hours": "number (optional, defaults to 1)"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "module_id": "uuid",
      "roadmap_id": "uuid",
      "title": "string",
      "description": "string|null",
      "content": "string|null",
      "order_index": 0,
      "estimated_hours": 0.0,
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions or not roadmap owner
  - `404 Not Found`: Roadmap not found
  - `500 Internal Server Error`

---

#### **Get Module Details**
- **Endpoint**: `GET /api/roadmaps/:roadmapId/modules/:moduleId`
- **Authentication**: Required
- **Path Parameters**:
  - `roadmapId`: Valid UUID string
  - `moduleId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "module_id": "uuid",
      "roadmap_id": "uuid",
      "title": "string",
      "description": "string|null",
      "content": "string|null",
      "order_index": 0,
      "estimated_hours": 0.0,
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Module not found
  - `500 Internal Server Error`

---

#### **Update Module (Admin/Creator Only)**
- **Endpoint**: `PUT /api/roadmaps/:roadmapId/modules/:moduleId`
- **Authentication**: Required (Admin/Creator + Module Ownership)
- **Path Parameters**:
  - `roadmapId`: Valid UUID string
  - `moduleId`: Valid UUID string
- **Request Body** (any combination of):
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "content": "string (optional)",
    "order_index": "integer (optional)",
    "estimated_hours": "number (optional)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "module_id": "uuid",
      "roadmap_id": "uuid",
      "title": "string",
      "description": "string|null",
      "content": "string|null",
      "order_index": 0,
      "estimated_hours": 0.0,
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions or not owner
  - `404 Not Found`
  - `500 Internal Server Error`

---

#### **Delete Module (Admin/Creator Only)**
- **Endpoint**: `DELETE /api/roadmaps/:roadmapId/modules/:moduleId`
- **Authentication**: Required (Admin/Creator + Module Ownership)
- **Path Parameters**:
  - `roadmapId`: Valid UUID string
  - `moduleId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Module deleted"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions or not owner
  - `404 Not Found`
  - `500 Internal Server Error`

---

### **4. Progress Tracking Endpoints**

#### **Get User Dashboard Overview**
- **Endpoint**: `GET /api/progress/overview`
- **Authentication**: Required
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "enrolled_roadmaps": 0,
      "completed_modules": 0,
      "average_completion": "0.00"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Get Roadmap Progress**
- **Endpoint**: `GET /api/progress/roadmaps/:roadmapId`
- **Authentication**: Required
- **Path Parameters**:
  - `roadmapId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "roadmap_title": "string",
      "overall_progress": 0.0,
      "modules": [
        {
          "module_id": "uuid",
          "title": "string",
          "status": "not_started|in_progress|completed",
          "percentage": 0
        }
      ]
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Roadmap not found
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Get Module Progress**
- **Endpoint**: `GET /api/progress/modules/:moduleId/progress`
- **Authentication**: Required + Enrollment Check
- **Path Parameters**:
  - `moduleId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "progress_id": "uuid",
      "user_id": "uuid",
      "module_id": "uuid",
      "status": "not_started|in_progress|completed",
      "completion_percentage": 0.00,
      "started_at": "ISO datetime|null",
      "completed_at": "ISO datetime|null",
      "last_accessed_at": "ISO datetime",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not enrolled in module
  - `404 Not Found`: Progress entry not found
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Update Module Progress**
- **Endpoint**: `PATCH /api/progress/modules/:moduleId/progress`
- **Authentication**: Required + Enrollment Check
- **Path Parameters**:
  - `moduleId`: Valid UUID string
- **Request Body**:
  ```json
  {
    "status": "not_started|in_progress|completed",
    "completion_percentage": "number (0-100)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "progress_id": "uuid",
      "user_id": "uuid",
      "module_id": "uuid",
      "status": "not_started|in_progress|completed",
      "completion_percentage": 0.00,
      "started_at": "ISO datetime|null",
      "completed_at": "ISO datetime|null",
      "last_accessed_at": "ISO datetime",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not enrolled in module
  - `400 Bad Request`: Validation errors
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

### **5. Calendar Management Endpoints**

#### **List Learning Events**
- **Endpoint**: `GET /api/calendar/events`
- **Authentication**: Required
- **Query Parameters**:
  - `start`: ISO datetime string (optional)
  - `end`: ISO datetime string (optional)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "event_id": "uuid",
        "user_id": "uuid",
        "title": "string",
        "description": "string|null",
        "start_time": "ISO datetime",
        "end_time": "ISO datetime",
        "status": "planned|done|missed|cancelled",
        "created_at": "ISO datetime",
        "updated_at": "ISO datetime"
      }
    ],
    "error": null
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation errors for start/end dates
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Create Learning Event**
- **Endpoint**: `POST /api/calendar/events`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string (optional)",
    "start_time": "ISO datetime",
    "end_time": "ISO datetime",
    "status": "planned|done|missed|cancelled (optional, defaults to 'planned')"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "event_id": "uuid",
      "title": "string",
      "description": "string|null",
      "start_time": "ISO datetime",
      "end_time": "ISO datetime",
      "status": "planned|done|missed|cancelled",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation errors
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Update Learning Event**
- **Endpoint**: `PUT /api/calendar/events/:eventId`
- **Authentication**: Required + Ownership Check
- **Path Parameters**:
  - `eventId`: Valid UUID string
- **Request Body** (any combination of):
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "start_time": "ISO datetime (optional)",
    "end_time": "ISO datetime (optional)",
    "status": "planned|done|missed|cancelled (optional)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "event_id": "uuid",
      "title": "string",
      "description": "string|null",
      "start_time": "ISO datetime",
      "end_time": "ISO datetime",
      "status": "planned|done|missed|cancelled",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not owner of event
  - `400 Bad Request`: Validation errors
  - `404 Not Found`
  - `500 Internal Server Error`

---

#### **Delete Learning Event**
- **Endpoint**: `DELETE /api/calendar/events/:eventId`
- **Authentication**: Required + Ownership Check
- **Path Parameters**:
  - `eventId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Event deleted successfully"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not owner of event
  - `404 Not Found`
  - `500 Internal Server Error`

---

### **6. Certificate Management Endpoints**

#### **List User Certificates**
- **Endpoint**: `GET /api/certificates`
- **Authentication**: Required
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "certificate_id": "uuid",
        "roadmap_id": "uuid",
        "certificate_name": "string",
        "issue_date": "ISO datetime",
        "pdf_url": "string|null"
      }
    ],
    "error": null
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Download Certificate PDF**
- **Endpoint**: `GET /api/certificates/:certificateId/download`
- **Authentication**: Required + Ownership Check
- **Path Parameters**:
  - `certificateId`: Valid UUID string
- **Success Response (200 OK)**:
  - PDF file stream with `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename=document.pdf`
- **Error Responses**:
  - `403 Forbidden`: Not owner of certificate
  - `404 Not Found`: Certificate not found
  - `500 Internal Server Error`

---

#### **Issue Certificate (Admin Only)**
- **Endpoint**: `POST /api/certificates`
- **Authentication**: Required (Admin Only)
- **Request Body**:
  ```json
  {
    "roadmap_id": "uuid",
    "certificate_name": "string (min 3 chars)"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "certificate_id": "uuid",
      "user_id": "uuid",
      "roadmap_id": "uuid",
      "certificate_name": "string",
      "issue_date": "ISO datetime",
      "pdf_url": "string|null"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions (not admin)
  - `409 Conflict`: "Certificate already issued"
  - `400 Bad Request`: Validation errors
  - `500 Internal Server Error`

---

### **7. CV Management Endpoints**

#### **List User CVs**
- **Endpoint**: `GET /api/cvs`
- **Authentication**: Required
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "cv_id": "uuid",
        "user_id": "uuid",
        "cv_name": "string",
        "template_style": "modern|classic|minimal",
        "personal_info": "object",
        "education": "array",
        "experience": "array",
        "skills": "array",
        "projects": "array",
        "created_at": "ISO datetime",
        "updated_at": "ISO datetime"
      }
    ],
    "error": null
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Create CV**
- **Endpoint**: `POST /api/cvs`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "cv_name": "string",
    "template_style": "modern|classic|minimal",
    "personal_info": "object",
    "education": "array",
    "experience": "array",
    "skills": "array",
    "projects": "array"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "cv_id": "uuid",
      "user_id": "uuid",
      "cv_name": "string",
      "template_style": "modern|classic|minimal",
      "personal_info": "object",
      "education": "array",
      "experience": "array",
      "skills": "array",
      "projects": "array",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation errors
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Update CV**
- **Endpoint**: `PUT /api/cvs/:cvId`
- **Authentication**: Required + Ownership Check
- **Path Parameters**:
  - `cvId`: Valid UUID string
- **Request Body** (any combination of):
  ```json
  {
    "cv_name": "string (optional)",
    "template_style": "modern|classic|minimal (optional)",
    "personal_info": "object (optional)",
    "education": "array (optional)",
    "experience": "array (optional)",
    "skills": "array (optional)",
    "projects": "array (optional)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "cv_id": "uuid",
      "user_id": "uuid",
      "cv_name": "string",
      "template_style": "modern|classic|minimal",
      "personal_info": "object",
      "education": "array",
      "experience": "array",
      "skills": "array",
      "projects": "array",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not owner of CV
  - `404 Not Found`: CV not found
  - `400 Bad Request`: Validation errors
  - `500 Internal Server Error`

---

#### **Optimize CV Section**
- **Endpoint**: `POST /api/cvs/:cvId/optimize`
- **Authentication**: Required + Ownership Check
- **Path Parameters**:
  - `cvId`: Valid UUID string
- **Request Body**:
  ```json
  {
    "section": "string (e.g., 'skills', 'experience')",
    "index": "integer (optional, for array sections)",
    "text": "string (content to optimize)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "optimized_text": "string"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not owner of CV
  - `404 Not Found`: CV not found
  - `400 Bad Request`: Validation errors
  - `500 Internal Server Error`

---

#### **Generate CV PDF**
- **Endpoint**: `POST /api/cvs/:cvId/generate-pdf`
- **Authentication**: Required + Ownership Check
- **Path Parameters**:
  - `cvId`: Valid UUID string
- **Success Response (200 OK)**:
  - PDF file stream with `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename=document.pdf`
- **Error Responses**:
  - `403 Forbidden`: Not owner of CV
  - `404 Not Found`: CV not found
  - `500 Internal Server Error`

---

#### **Delete CV**
- **Endpoint**: `DELETE /api/cvs/:cvId`
- **Authentication**: Required + Ownership Check
- **Path Parameters**:
  - `cvId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "CV deleted successfully"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not owner of CV
  - `404 Not Found`: CV not found
  - `500 Internal Server Error`

---

### **8. Exercise Management Endpoints**

#### **List Exercises**
- **Endpoint**: `GET /api/exercises`
- **Authentication**: Required + Enrollment Check
- **Query Parameters**:
  - `module_id`: Valid UUID string (required)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "exercise_id": "uuid",
        "module_id": "uuid",
        "title": "string",
        "description": "string",
        "difficulty": "easy|medium|hard",
        "examples": "json?",
        "created_at": "ISO datetime",
        "updated_at": "ISO datetime"
      }
    ],
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not enrolled in module
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **Get Exercise Details**
- **Endpoint**: `GET /api/exercises/:exerciseId`
- **Authentication**: Required + Exercise Ownership Check (check if you are owner of the exercise)
- **Path Parameters**:
  - `exerciseId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "exercise_id": "uuid",
      "module_id": "uuid",
      "title": "string",
      "description": "string",
      "difficulty": "easy|medium|hard",
      "examples": "array",
      "starter_code": "string|null",
      "solution_code": "string|null",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not owner of exercise
  - `404 Not Found`: Exercise not found
  - `500 Internal Server Error`

---

#### **Create Exercise (Admin/Creator Only)**
- **Endpoint**: `POST /api/exercises`
- **Authentication**: Required (Admin/Creator) + Module Ownership Check
- **Request Body**:
  ```json
  {
    "module_id": "uuid",
    "title": "string",
    "description": "string",
    "difficulty": "easy|medium|hard",
    "examples": "array (optional)",
    "starter_code": "string (optional)",
    "solution_code": "string (optional)"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "exercise_id": "uuid",
      "module_id": "uuid",
      "title": "string",
      "description": "string",
      "difficulty": "easy|medium|hard",
      "examples": "array",
      "starter_code": "string|null",
      "solution_code": "string|null",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions or not module owner
  - `400 Bad Request`: Validation errors
  - `500 Internal Server Error`

---

#### **Update Exercise (Admin/Creator Only)**
- **Endpoint**: `PUT /api/exercises/:exerciseId`
- **Authentication**: Required (Admin/Creator)
- **Path Parameters**:
  - `exerciseId`: Valid UUID string
- **Request Body** (any combination of):
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "difficulty": "easy|medium|hard (optional)",
    "examples": "array (optional)",
    "starter_code": "string (optional)",
    "solution_code": "string (optional)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "exercise_id": "uuid",
      "module_id": "uuid",
      "title": "string",
      "description": "string",
      "difficulty": "easy|medium|hard",
      "examples": "array",
      "starter_code": "string|null",
      "solution_code": "string|null",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions
  - `404 Not Found`: Exercise not found
  - `400 Bad Request`: Validation errors
  - `500 Internal Server Error`

---

#### **Delete Exercise (Admin/Creator Only)**
- **Endpoint**: `DELETE /api/exercises/:exerciseId`
- **Authentication**: Required (Admin/Creator) + Exercise Ownership Check
- **Path Parameters**:
  - `exerciseId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Exercise deleted successfully"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions or not owner
  - `404 Not Found`: Exercise not found
  - `500 Internal Server Error`

---

#### **Submit Exercise Solution**
- **Endpoint**: `POST /api/exercises/:exerciseId/submit`
- **Authentication**: Required
- **Path Parameters**:
  - `exerciseId`: Valid UUID string
- **Request Body**:
  ```json
  {
    "answer_text": "string"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "submission_id": "uuid",
      "exercise_id": "uuid",
      "user_id": "uuid",
      "answer_text": "string",
      "feedback": "string|null",
      "score": 0.0,
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`
  - `404 Not Found`: Exercise not found
  - `400 Bad Request`: Validation errors
  - `500 Internal Server Error`

---

### **9. Interview Management Endpoints**

#### **Start Interview Session**
- **Endpoint**: `POST /api/interviews/sessions`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "session_name": "string",
    "interview_type": "simulated|prep_feedback"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "session_id": "uuid",
      "questions": "Json?",
    "error": null
  }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation errors
  - `500 Internal Server Error`

---

#### **Submit Interview Answers**
- **Endpoint**: `POST /api/interviews/sessions/:sessionId/submit`
- **Authentication**: Required + Session Ownership Check
- **Path Parameters**:
  - `sessionId`: Valid UUID string
- **Request Body**:
  ```json
  {
    "user_answers": [
      {
        "question_id": "string",
        "answer": "string"
      }
    ]
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "session_id": "uuid",
      "session_name": "string",
      "interview_type": "simulated|prep_feedback",
      "user_answers": "array",
      "ai_feedback": "object",
      "score": 0.0,
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not owner of session
  - `404 Not Found`: Session not found
  - `400 Bad Request`: Validation errors
  - `500 Internal Server Error`

---

#### **List Interview Sessions**
- **Endpoint**: `GET /api/interviews/sessions`
- **Authentication**: Required
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "session_id": "uuid",
        "session_name": "string",
        "interview_type": "simulated|prep_feedback",
        "score": 0.0,
        "created_at": "ISO datetime",
        "ai_feedback": "object"
      }
    ],
    "error": null
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

### **10. WebSocket Interview Endpoint**

#### **Interview WebSocket Connection**
- **Endpoint**: `ws://your-domain.com/interviews/ws`
- **Authentication**: Required (via initial auth message)
- **Message Flow**:
  1. **Authentication**:
     ```json
     {
       "type": "auth",
       "payload": {
         "token": "JWT token from cookie",
         "session_id": "uuid"
       }
     }
     ```
  2. **Answer Submission (Text)**:
     ```json
     {
       "type": "answer_text",
       "payload": {
         "text": "Your answer text"
       }
     }
     ```
  3. **Answer Submission (Audio)**:
     ```json
     {
       "type": "answer_audio",
       "payload": {
         "audio_base64": "base64-encoded audio data"
       }
     }
     ```
  4. **End Session**:
     ```json
     {
       "type": "end_session"
     }
     ```

- **Server Responses**:
  - **Next Question**:
    ```json
    {
      "type": "question",
      "payload": {
        "index": 0,
        "total": 5,
        "question_id": "string",
        "text": "Question text"
      }
    }
    ```
  - **Transcription Result**:
    ```json
    {
      "type": "transcription",
      "payload": {
        "text": "Transcribed text",
        "question_id": "string"
      }
    }
    ```
  - **Session Finished**:
    ```json
    {
      "type": "finished",
      "payload": {
        "message": "All questions answered"
      }
    }
    ```
  - **Error**:
    ```json
    {
      "type": "error",
      "payload": {
        "message": "Error message"
      }
    }
    ```

- **Error Cases**:
  - Invalid token
  - Session not found or unauthorized access
  - Audio transcription failure
  - Internal server errors

---

### **11. AI Notes Endpoints**

#### **AI Chat in Module**
- **Endpoint**: `POST /api/modules/:moduleId/ai-chat`
- **Authentication**: Required + Module Enrollment Check
- **Path Parameters**:
  - `moduleId`: Valid UUID string
- **Request Body**:
  ```json
  {
    "message": "string"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "response": "string (AI-generated response)"
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not enrolled in module
  - `400 Bad Request`: Validation errors
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### **List AI Notes for Module**
- **Endpoint**: `GET /api/modules/:moduleId/ai-notes`
- **Authentication**: Required + Module Enrollment Check
- **Path Parameters**:
  - `moduleId`: Valid UUID string
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "note_id": "uuid",
        "module_id": "uuid",
        "user_id": "uuid",
        "content": "string",
        "note_type": "summary|hint|explanation|feedback|user_question|ai_response",
        "created_at": "ISO datetime",
        "updated_at": "ISO datetime",
        "sequence_order": "int"
      }
    ],
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Not enrolled in module
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

This comprehensive API documentation covers all endpoints present in the provided backend code. Each endpoint includes detailed information about authentication requirements, request parameters, expected responses, and possible error conditions. No endpoints have been added that aren't explicitly defined in the router files provided.