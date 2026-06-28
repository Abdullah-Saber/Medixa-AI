# Medixa AI - Full Stack Application

🩸 Blood test booking system with AI-powered interpretation

## Architecture

This project follows **Clean Architecture** principles with a **Hybrid Presentation Model**:

### Backend (.NET 8)
- **Domain Layer**: Core business entities and enums (no dependencies)
- **Application Layer**: Business logic, services, DTOs, dependency injection (depends only on Domain)
- **Infrastructure Layer**: Data access (Entity Framework Core), migrations (depends only on Domain)
- **API Layer**: Hybrid MVC + Web API
  - **MVC Controllers**: Server-side rendered dashboards (Doctor, Staff, Patient)
  - **API Controllers**: REST endpoints for React frontend

### Frontend (React 19 + Vite)
- Modern React application with Vite
- Tailwind CSS for styling
- i18next for internationalization
- React Router for navigation
- Context API for state management
- Consumes REST API from backend

## Project Structure

```
Medixa-AI/
├── backend/
│   ├── Medixa-AI.Domain/          # Core entities and enums
│   ├── Medixa-AI.Application/     # Business logic, services, DTOs
│   │   ├── Interfaces/
│   │   ├── Services/
│   │   └── DTOs/
│   ├── Medixa-AI.Infrastructure/  # Data access and migrations
│   │   ├── Persistence/
│   │   └── Migrations/
│   └── Medixa-AI.Api/             # Hybrid MVC + API
│       ├── Controllers/
│       │   ├── Mvc/              # Dashboard controllers
│       │   │   ├── DoctorDashboardController
│       │   │   ├── StaffDashboardController
│       │   │   └── PatientDashboardController
│       │   └── Api/              # REST controllers for React
│       │       ├── PatientController
│       │       ├── OrderController
│       │       ├── ResultController
│       │       └── AIController
│       ├── Views/
│       │   ├── Doctor/
│       │   ├── Staff/
│       │   ├── Patient/
│       │   └── Shared/
│       └── ViewModels/
├── frontend/                       # React frontend
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── i18n/
├── tests/                          # Test projects
│   ├── Application.Tests/
│   └── Infrastructure.Tests/
├── docs/                           # Documentation
├── design/                         # Wireframes and designs
└── Medixa-AI.sln                   # .NET solution file
```

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- SQL Server (or LocalDB)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Update connection string in `backend/Medixa-AI.Api/appsettings.json`

4. Run migrations:
```bash
cd Medixa-AI.Infrastructure
dotnet ef database update
```

5. Run the API:
```bash
cd ../Medixa-AI.Api
dotnet run
```

API will be available at: `https://localhost:5001` (or configured port)
- **MVC Dashboards**: `https://localhost:5001/DoctorDashboard`, `/StaffDashboard`, `/PatientDashboard`
- **Swagger UI**: `https://localhost:5001/swagger`
- **API Endpoints**: `https://localhost:5001/api/*`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Clean Architecture Rules

### Dependency Flow
- **Domain**: No dependencies on other layers
- **Application**: Depends ONLY on Domain
- **Infrastructure**: Depends ONLY on Domain
- **API**: Depends on Application and Infrastructure (via DI)
- **Frontend**: Communicates with API via HTTP (no direct database access)

### Layer Responsibilities
- **Domain**: Entities, enums only
- **Application**: Interfaces, services, DTOs (no DbContext or EF Core)
- **Infrastructure**: DbContext, EF Core, migrations
- **API (MVC)**: Returns Views, uses Application services, server-side rendering
- **API (REST)**: Returns JSON only, uses Application services, serves React frontend

### Data Flow
**Dashboards (MVC)**: MVC Controller → Application Service → Infrastructure → DB
**User App (React)**: React → API Controller → Application Service → Infrastructure → DB

### DTO Enforcement
- Never return entities directly from API
- Always return DTOs
- ViewModels used for MVC dashboards

## Features

- 🩸 Blood test booking system
- 🧪 Lab results management
- 🤖 AI interpretation
- 📊 Trend tracking
- 🧠 Smart medical recommendations
- 🗂 Patient history insights
- 🗣 Simplified reports for non-medical users
- 📊 Server-side rendered dashboards (Doctor, Staff, Patient)
- 🌐 REST API for React frontend

## Documentation

See the `docs/` folder for:
- SRS (Software Requirements Specification)
- Class diagrams and specifications
- System overview

See the `design/` folder for:
- Wireframes
- UI/UX designs
