# EcoSphere ERP Backend (Phase 1 Mock Storage & JWT Auth)

Welcome to the backend API services for EcoSphere, an ERP-based ESG Management Platform.

This phase implementation provides fully modular FastAPI routing, JWT authentication, Bcrypt password hashing, and role-based access control (RBAC) backed by an in-memory repository pattern. Database integrations (SQLAlchemy + PostgreSQL) can be swapped in during Phase 2 without modifying API routes or logic signatures.

---

## Technical Stack
* **Python**: 3.12+
* **FastAPI**: Modern, fast web framework
* **Pydantic v2**: Secure schema structures and payload validators
* **python-jose**: JWT signature generation and token extraction
* **passlib [bcrypt]**: Thread-safe Bcrypt password hashing
* **Uvicorn**: Lightweight ASGI web server

---

## Project Structure

```
backend/
├── requirements.txt      # Python dependencies
├── .env                  # Port, JWT secret and expire configs
├── test_api.py           # Automated test suite
└── app/
    ├── main.py           # FastAPI app configurations & global error wrappers
    ├── config.py         # App configurations loading from .env
    ├── security.py       # Password validation and JWT creation utilities
    ├── database.py       # Simulated in-memory storage and seed configurations
    ├── dependencies.py   # Dependency injection resolvers & RBAC guard checkers
    ├── middleware/
    │   └── logging.py    # Request timing & access logger middleware
    ├── api/
    │   ├── auth.py       # Auth endpoints (Register, Login, Profile)
    │   ├── users.py      # User CRUD operations
    │   └── departments.py # Department CRUD operations
    ├── models/
    │   ├── user.py       # User domain model class
    │   └── department.py # Department domain model class
    ├── schemas/
    │   ├── common.py     # Generic APIResponse wrapper envelope
    │   ├── auth.py       # Sign-in and Sign-up schemas
    │   ├── user.py       # User profiles validator schemas
    │   └── department.py # Department validator schemas
    ├── services/
    │   ├── auth.py       # Authentication services
    │   ├── user.py       # User profiles business logic
    │   └── department.py # Department business logic
    └── repositories/
        ├── base.py       # Abstract Base Repository interface
        ├── user.py       # User database repository operations
        └── department.py # Department database repository operations
```

---

## Pre-populated Seed Accounts

The system automatically initializes the following accounts on startup for instant frontend integration:

| Email | Password | Role | Department |
| :--- | :--- | :--- | :--- |
| **`admin@ecosphere.com`** | `AdminPass123` | **Admin** | Sustainability & ESG (`dep-1`) |
| **`manager@ecosphere.com`** | `ManagerPass123` | **Manager** | Sustainability & ESG (`dep-1`) |
| **`employee@ecosphere.com`** | `EmployeePass123` | **Employee** | Operations & Logistics (`dep-2`) |

---

## Setting Up and Running

### 1. Requirements Installation
Ensure you are in the `backend` directory and create a virtual environment, then install requirements:

```bash
# Windows PowerShell
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment variables
Environment variables are configured in the pre-packaged `.env` file:
```env
JWT_SECRET_KEY=85e8d53347f3b89b4f2c00df0b5e282bc726194b5952d3a3ebf61a1532cb1b2c
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=development
PORT=8000
HOST=0.0.0.0
```

### 3. Run FastAPI Application
Start the ASGI server:
```bash
uvicorn app.main:app --reload
```
API Documentation and Swagger UI will be live at:
* **Interactive Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## Running Automated Verification Tests

The project includes a comprehensive test suite utilizing `pytest` and `TestClient` to verify auth flows, CORS behavior, standard response formatting, and RBAC policies.

Run the test suite:
```bash
pytest test_api.py -v
```

---

## API Documentation Standards

All endpoints follow the **Standard JSON Envelope**:

### Success Response Envelope
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {
    "id": "usr-1",
    "name": "Global ESG Administrator"
  }
}
```

### Error Response Envelope
```json
{
  "success": false,
  "message": "Validation failed: body -> email: value is not a valid email address",
  "data": null
}
```
