# Medixa-AI Comprehensive Project Report

**Generated:** April 30, 2026  
**Repository:** Abdullah-Saber/Medixa-AI  
**Branch:** main  
**Report Type:** Complete Technical & Business Analysis

---

## 📊 Executive Summary

**Overall Project Completion: 45%**

The Medixa-AI project is a Smart Medical Lab Intelligence System built with Clean Architecture (.NET 8 backend) and React frontend. The project demonstrates solid architectural foundations but requires significant work in entity implementation, lifecycle management, MVC dashboard fixes, and frontend integration.

**Key Strengths:**
- Clean Architecture properly implemented (Domain, Application, Infrastructure, API layers)
- Role-based authorization logic correctly enforced
- Generic repository pattern implemented
- No 500 errors from authorization failures
- Git workflow guidelines established

**Critical Issues:**
- MVC views are broken (reference non-existent ViewModel properties)
- Only 6/20 entities have complete DTOs/Services/Controllers
- No JWT authentication (using temporary header-based approach)
- Frontend not connected to backend API
- Zero test coverage
- Result module blocked by missing OrderDetail service

---

## 🏗️ Repository Structure & Configuration

### Root Structure Analysis

```
Medixa-AI/
├── backend/              # ✅ Clean Architecture .NET backend
├── frontend/             # ✅ React application
├── docs/                 # ✅ Documentation
├── design/               # ✅ Design files
├── tests/                # ⚠️ Empty (no tests yet)
├── .gitignore            # ✅ Configured
├── Medixa-AI.sln         # ✅ .NET solution file
└── README.md             # ✅ Project documentation
```

**Configuration Status:** ✅ **CLEAN**
- All configuration files properly organized in `frontend/`
- No clutter at root level
- Test files moved to `backend/tests/`
- Public assets in `frontend/public/`

---

## 👥 Team Contributors

| Author | Commits | Areas of Work |
|--------|---------|----------------|
| Abdullah-Saber | 8 | Backend Clean Architecture, React frontend, repository organization |
| nairam0 (Naira Mostafa) | 2 | Patient Dashboard |
| Hady Ayman | 5 | Controllers, file management |
| Nada Ibrahem | 1 | Initial commit |
| zeyad ayman elmaghrabi | 4 | Early backend setup, DbContext |

**Note:** Nada Ibrahem's contribution exists in git history but not in main branch's direct ancestry due to merge with unrelated histories.

---

## 🔹 Layer-by-Layer Analysis

### 1. Domain Layer

**Status:** ✅ **COMPLETED (100%)**

#### Entities Implemented (20/20)
- ✅ Specialization
- ✅ Doctor
- ✅ Patient
- ✅ Employee
- ✅ LabTest
- ✅ TestNormalRange
- ✅ TestPrerequisite
- ✅ TestCheckupPolicy
- ✅ TestOrder
- ✅ OrderDetail
- ✅ TestResult
- ✅ TestMedicalRule
- ✅ AIInterpretation
- ✅ CheckupRecommendation
- ✅ Appointment
- ✅ Payment
- ✅ MembershipCategory
- ✅ PatientMembership
- ✅ UploadedMedicalFile
- ✅ HealthMetricSnapshot

#### Enums Implemented (10/10)
- ✅ EmployeeRole (Admin, Receptionist, Technician)
- ✅ OrderStatus (Pending, InProgress, Completed, Cancelled)
- ✅ TestStatus (Pending, InProgress, Completed, Abnormal)
- ✅ Gender (Male, Female)
- ✅ RiskLevel (Low, Medium, High, Critical)
- ✅ RecommendationStatus (Pending, Completed, Cancelled)
- ✅ AppointmentStatus (Scheduled, Completed, Cancelled, NoShow)
- ✅ PaymentMethod (Cash, Card, Insurance)
- ✅ PaymentStatus (Pending, Completed, Failed, Refunded)
- ✅ TrendType (Improving, Stable, Worsening)

**Assessment:** Domain layer is production-ready with complete ERD implementation.

---

### 2. Infrastructure Layer

**Status:** ✅ **COMPLETED (100%)**

#### Components Implemented
- ✅ **AppDbContext** - All 20 entities registered as DbSets
- ✅ **EF Core Configuration** - Complete relationship mapping
- ✅ **Fluent API** - Keys, constraints, cascade behaviors
- ✅ **Generic Repository** - IRepository<T> interface and Repository<T> implementation
- ✅ **Migrations** - Initial migration created
- ✅ **Dependency Injection** - Infrastructure DI configured

**Features:**
- One-to-One and One-to-Many relationships configured
- Cascade behaviors properly set
- Property constraints (length, precision, required)
- Enum conversions (byte)
- Indexes on critical fields (NationalID, Phone, OrderID, OrderDetailID)
- Default values (NEWSEQUENTIALID, DateTime.UtcNow)

**Assessment:** Infrastructure layer is production-ready with complete data access layer.

---

### 3. Application Layer

**Status:** ⚠️ **IN PROGRESS (35%)**

#### DTOs Implemented (7/20)
- ✅ EmployeeDto
- ✅ DoctorDto
- ✅ PatientDto
- ✅ OrderDto
- ✅ ResultDto
- ✅ SpecializationDto
- ✅ AIDto

#### Services Implemented (6/20)
- ✅ EmployeeService (with lifecycle logic)
- ✅ DoctorService (basic CRUD)
- ✅ PatientService (basic CRUD)
- ✅ OrderService (with role-based logic)
- ✅ ResultService (with role-based logic)
- ✅ SpecializationService (basic CRUD)

#### Interfaces Implemented (7/20)
- ✅ IEmployeeService
- ✅ IDoctorService
- ✅ IPatientService
- ✅ IOrderService
- ✅ IResultService
- ✅ ISpecializationService
- ✅ IRepository<T>

#### Missing DTOs (13/20)
- ❌ LabTestDto
- ❌ OrderDetailDto **(CRITICAL - blocks Result module)**
- ❌ TestNormalRangeDto
- ❌ TestPrerequisiteDto
- ❌ TestCheckupPolicyDto
- ❌ TestMedicalRuleDto
- ❌ AIInterpretationDto
- ❌ CheckupRecommendationDto
- ❌ AppointmentDto
- ❌ PaymentDto
- ❌ MembershipCategoryDto
- ❌ PatientMembershipDto
- ❌ UploadedMedicalFileDto
- ❌ HealthMetricSnapshotDto

#### Missing Services (14/20)
- ❌ ILabTestService & LabTestService
- ❌ IOrderDetailService & OrderDetailService **(CRITICAL)**
- ❌ ITestNormalRangeService & TestNormalRangeService
- ❌ ITestPrerequisiteService & TestPrerequisiteService
- ❌ ITestCheckupPolicyService & TestCheckupPolicyService
- ❌ ITestMedicalRuleService & TestMedicalRuleService
- ❌ IAIInterpretationService & AIInterpretationService
- ❌ ICheckupRecommendationService & CheckupRecommendationService
- ❌ IAppointmentService & AppointmentService
- ❌ IPaymentService & PaymentService
- ❌ IMembershipCategoryService & MembershipCategoryService
- ❌ IPatientMembershipService & PatientMembershipService
- ❌ IUploadedMedicalFileService & UploadedMedicalFileService
- ❌ IHealthMetricSnapshotService & HealthMetricSnapshotService

**Assessment:** Application layer has solid foundation but 70% of entities lack implementation.

---

### 4. API Layer

**Status:** ⚠️ **IN PROGRESS (35%)**

#### API Controllers Implemented (7/20)
- ✅ EmployeeController (with lifecycle endpoints)
- ✅ DoctorController (basic CRUD)
- ✅ PatientController (basic CRUD)
- ✅ OrderController (with role restrictions)
- ✅ ResultController (with role restrictions)
- ✅ SpecializationController (basic CRUD)
- ✅ AIController (basic implementation)

#### Advanced Features
- ✅ Role-based authorization (via header - temporary)
- ✅ TryGetRequesterRole helper method (safe parsing)
- ✅ Proper HTTP status codes (200, 201, 400, 401, 404)
- ✅ No 500 errors from authorization
- ✅ CORS configuration for React integration

#### Missing API Controllers (13/20)
- ❌ LabTestController
- ❌ OrderDetailController **(CRITICAL)**
- ❌ TestNormalRangeController
- ❌ TestPrerequisiteController
- ❌ TestCheckupPolicyController
- ❌ TestMedicalRuleController
- ❌ AIInterpretationController
- ❌ CheckupRecommendationController
- ❌ AppointmentController
- ❌ PaymentController
- ❌ MembershipCategoryController
- ❌ PatientMembershipController
- ❌ UploadedMedicalFileController
- ❌ HealthMetricSnapshotController

#### Security Issues
- ❌ Using temporary header-based role passing instead of JWT
- ❌ No global exception handler
- ❌ No API versioning
- ❌ No rate limiting
- ❌ No request validation middleware

**Assessment:** API layer works for implemented entities but lacks security and completeness.

---

### 5. MVC Layer

**Status:** ❌ **BROKEN (Views Don't Match ViewModels)**

#### MVC Controllers Implemented (3/3)
- ✅ StaffDashboardController
- ✅ DoctorDashboardController
- ✅ PatientDashboardController

#### ViewModels Implemented (3/3)
- ✅ StaffDashboardViewModel
- ✅ DoctorDashboardViewModel
- ✅ PatientDashboardViewModel

#### Views Implemented (3/3)
- ✅ Staff/Index.cshtml
- ✅ Doctor/Index.cshtml
- ✅ Patient/Index.cshtml
- ✅ Shared/_Layout.cshtml

#### ❌ CRITICAL ISSUE: Views Reference Non-Existent Properties

**Staff/Index.cshtml references:**
- ❌ `@Model.PendingOrders` - NOT in StaffDashboardViewModel
- ❌ `@Model.InProgressOrders` - NOT in StaffDashboardViewModel
- ❌ `@Model.CompletedToday` - NOT in StaffDashboardViewModel
- ❌ `@Model.TotalLabTests` - NOT in StaffDashboardViewModel
- ❌ `@Model.PendingOrdersList` - NOT in StaffDashboardViewModel
- ❌ `@Model.LabTestStats` - NOT in StaffDashboardViewModel

**Actual StaffDashboardViewModel contains:**
- AllStaff, ActiveStaff, AdminCount, TechnicianCount, ReceptionistCount, InactiveCount

**Doctor/Index.cshtml references:**
- ❌ `@Model.TotalPatients` - NOT in DoctorDashboardViewModel
- ❌ `@Model.PendingAppointments` - NOT in DoctorDashboardViewModel
- ❌ `@Model.TodayResults` - NOT in DoctorDashboardViewModel
- ❌ `@Model.ActiveOrders` - NOT in DoctorDashboardViewModel
- ❌ `@Model.RecentPatients` - NOT in DoctorDashboardViewModel
- ❌ `@Model.UpcomingAppointments` - NOT in DoctorDashboardViewModel

**Actual DoctorDashboardViewModel contains:**
- AllDoctors, TotalOrders, TotalResults, ActiveDoctors

**Hardcoded Role Issue:**
```csharp
// StaffDashboardController lines 57, 66
var currentRole = EmployeeRole.Admin; // ← Hardcoded!
// TODO: Replace with authenticated user role (JWT/Claims)
```

**Assessment:** MVC layer will crash at runtime due to view/ViewModel mismatch. Immediate fix required.

---

### 6. Frontend Layer

**Status:** ⚠️ **IN PROGRESS (40%)**

#### Pages Implemented (7/7)
- ✅ HomePage
- ✅ AboutPage
- ✅ ServicesPage
- ✅ LoginPage
- ✅ RegisterPage
- ✅ AdminDashboard
- ✅ BookAppointmentPage

#### Components Implemented (6/6)
- ✅ Navbar
- ✅ Logo
- ✅ LanguageSwitcher
- ✅ FooterSocial (empty)
- ✅ AdminRoute (auth guard)
- ✅ ProtectedRoute (auth guard)

#### Context Implemented (2/2)
- ✅ AuthContext (basic structure)
- ✅ LanguageContext (i18n support)

#### Configuration
- ✅ Vite + React setup
- ✅ Tailwind CSS
- ✅ ESLint
- ✅ i18n (internationalization)
- ✅ Public assets (images, icons)

#### ❌ Critical Missing Features
- ❌ React not connected to .NET API
- ❌ No authentication flow with backend
- ❌ No JWT token handling
- ❌ No API service layer (axios/fetch wrapper)
- ❌ No error handling for API calls
- ❌ No loading states

#### Missing Pages
- ❌ Patient Dashboard
- ❌ Staff Dashboard
- ❌ Doctor Dashboard
- ❌ Test Results View
- ❌ Order History
- ❌ Appointment Management
- ❌ Profile Settings
- ❌ File Upload Page

#### Missing Components
- ❌ Data tables (for dashboards)
- ❌ Forms (for data entry)
- ❌ Charts (for analytics)
- ❌ Modals (for confirmations)
- ❌ Toast notifications
- ❌ Loading spinners
- ❌ Pagination components

**Assessment:** Frontend is scaffolded but has zero backend integration.

---

### 7. Testing Layer

**Status:** ❌ **NOT STARTED (0%)**

#### Test Coverage
- ❌ No unit tests
- ❌ No integration tests
- ❌ No end-to-end tests
- ❌ No test framework configured
- ❌ No test data management

#### Manual Testing
- ⚠️ Partial (Employee, Order, Result endpoints tested manually)
- ❌ No comprehensive test plan
- ❌ No test environment setup

**Assessment:** Zero test coverage represents significant risk.

---

## 🔄 Lifecycle Implementation Analysis

### ✅ Implemented Lifecycle Logic

**Employee Lifecycle:**
- ✅ ActivateAsync - Admin can activate employees
- ✅ DeactivateAsync - Admin can deactivate employees
- ✅ GetActiveEmployeesAsync - Query only active employees
- ✅ GetByRoleAsync - Query employees by role
- ✅ Role-based restrictions - Create/Update only by Admin

**Order Lifecycle:**
- ✅ Role-based creation - Only Admin and Receptionist can create orders
- ✅ Role-based updates - Only Admin and Receptionist can update orders
- ✅ Query methods - GetByPatient, GetByTechnician
- ⚠️ Status tracking - OrderStatus enum exists but no transition logic

**Result Lifecycle:**
- ✅ Role-based creation - Only Technician can create results
- ✅ Role-based updates - Only Technician can update results
- ✅ Query methods - GetByTechnician, GetByOrder
- ⚠️ Status tracking - TestStatus enum exists but no transition logic

### ❌ Missing Lifecycle Logic

**Patient Lifecycle:**
- ❌ Activate/Deactivate patients
- ❌ Patient status tracking (Active, Inactive, Deceased)
- ❌ Membership lifecycle management
- ❌ Health metric tracking over time

**Appointment Lifecycle:**
- ❌ Schedule appointment
- ❌ Cancel appointment
- ❌ Reschedule appointment
- ❌ Mark as no-show
- ❌ Complete appointment
- ❌ AppointmentStatus transitions

**Payment Lifecycle:**
- ❌ Create payment
- ❌ Process payment
- ❌ Refund payment
- ❌ PaymentStatus transitions (Pending → Completed/Failed/Refunded)

**Test Lifecycle:**
- ❌ Order → InProgress → Completed flow
- ❌ Automated status transitions
- ❌ Test prerequisite validation
- ❌ Checkup policy enforcement

**Membership Lifecycle:**
- ❌ Create membership
- ❌ Renew membership
- ❌ Upgrade/downgrade membership
- ❌ Expiration tracking

**Health Metric Lifecycle:**
- ❌ Track trends (Improving, Stable, Worsening)
- ❌ Risk level updates
- ❌ Alert thresholds

### Lifecycle Implementation Summary

| Entity | Activate/Deactivate | Status Transitions | Role Restrictions | Query Methods |
|--------|-------------------|-------------------|------------------|---------------|
| Employee | ✅ | ✅ | ✅ | ✅ |
| Order | ❌ | ⚠️ Partial | ✅ | ✅ |
| Result | ❌ | ⚠️ Partial | ✅ | ✅ |
| Patient | ❌ | ❌ | ❌ | ❌ |
| Appointment | ❌ | ❌ | ❌ | ❌ |
| Payment | ❌ | ❌ | ❌ | ❌ |
| Membership | ❌ | ❌ | ❌ | ❌ |

---

## 🎯 Business Logic Assessment

### What's LOGICALLY CORRECT

**Employee Management:**
- ✅ Role-based authorization (Admin only can create/update)
- ✅ Lifecycle management (activate/deactivate)
- ✅ Query methods (active, by role)
- ✅ Safe return handling (no exceptions)

**Order Management:**
- ✅ Role-based authorization (Admin/Receptionist only)
- ✅ Query methods (by patient, by technician)
- ✅ Safe return handling

**Result Management:**
- ✅ Role-based authorization (Technician only)
- ✅ Query methods (by technician, by order)
- ✅ Safe return handling

### What's MISSING or INCORRECT

**Order Lifecycle:**
- ❌ No automated status transitions (Pending → InProgress → Completed)
- ❌ No prerequisite validation
- ❌ No checkup policy enforcement

**Result Module:**
- ❌ FK constraint issue (requires valid OrderDetail)
- ❌ OrderDetail service not implemented
- ❌ Temporary workaround in place (commented out validation)

**Patient Management:**
- ❌ No status management
- ❌ No membership integration
- ❌ No health metric tracking

**Appointment Management:**
- ❌ No appointment service
- ❌ No status transitions
- ❌ No scheduling logic

**Payment Management:**
- ❌ No payment service
- ❌ No payment processing
- ❌ No refund logic

---

## 🚨 Critical Issues Summary

### 1. MVC Views Broken (CRITICAL - Runtime Errors)
**Impact:** Dashboards will crash when accessed
**Fix Required:** Update ViewModels to match view requirements or update views to match ViewModels

### 2. Result Module Blocked (CRITICAL)
**Impact:** Cannot create results due to missing OrderDetail service
**Fix Required:** Implement OrderDetailDto, OrderDetailService, OrderDetailController

### 3. No Authentication (HIGH)
**Impact:** Using temporary header-based role passing, insecure
**Fix Required:** Implement JWT authentication with refresh tokens

### 4. Frontend Not Connected (HIGH)
**Impact:** React has no backend integration
**Fix Required:** Implement API service layer, authentication flow, error handling

### 5. Zero Test Coverage (HIGH)
**Impact:** No validation of code correctness
**Fix Required:** Implement unit tests, integration tests, test framework

### 6. Missing Entity Implementations (MEDIUM)
**Impact:** 70% of entities lack DTOs/Services/Controllers
**Fix Required:** Implement remaining 14 entities

---

## 📋 Priority Roadmap

### Phase 1: Critical Fixes (Week 1)
1. **Fix MVC Views** - Update ViewModels to match view requirements
2. **Implement OrderDetail Service & Controller** - Unblock Result module
3. **Implement LabTest Service & Controller** - Required for OrderDetail
4. **Fix Result Module FK Constraint** - Remove temporary workaround
5. **Add Unit Tests for Existing Services** - Basic test coverage

### Phase 2: Authentication & Security (Week 2)
1. **Implement JWT Authentication** - Replace header-based approach
2. **Add Refresh Token Mechanism** - Secure token management
3. **Implement Role-Based Authorization Middleware** - Centralized auth
4. **Add Global Exception Handler** - Consistent error responses
5. **Add API Rate Limiting** - Prevent abuse

### Phase 3: Frontend Integration (Week 3-4)
1. **Connect React to .NET API** - Basic API calls
2. **Implement Authentication Flow** - Login/register with backend
3. **Add API Service Layer** - Axios/fetch wrapper
4. **Implement Error Handling** - User-friendly error messages
5. **Add Loading States** - Better UX
6. **Create Missing Pages** - Patient/Staff/Doctor dashboards

### Phase 4: Complete Entity Implementation (Week 5-7)
1. **Implement Payment Service & Controller** - Order lifecycle
2. **Implement Appointment Service & Controller** - Patient management
3. **Implement Membership Services** - Patient benefits
4. **Implement Health Metric Services** - Advanced analytics
5. **Implement AI Interpretation Services** - Core feature
6. **Implement File Upload Services** - Medical documents

### Phase 5: Advanced Features (Week 8-10)
1. **Implement Status Transition Logic** - Automated workflows
2. **Add Prerequisite Validation** - Test dependencies
3. **Add Checkup Policy Enforcement** - Business rules
4. **Implement Real-time Updates** - SignalR for dashboards
5. **Add Export Functionality** - PDF, Excel reports
6. **Performance Optimization** - Caching, indexing

### Phase 6: Testing & Quality (Week 11-12)
1. **Add Comprehensive Unit Tests** - 80% coverage target
2. **Add Integration Tests** - End-to-end workflows
3. **Implement Test Coverage Reporting** - Continuous monitoring
4. **Security Audit** - Penetration testing
5. **Performance Testing** - Load testing
6. **Documentation Completion** - API docs, user guides

---

## 📊 Metrics Dashboard

### Entity Implementation Progress
| Category | Total | Implemented | Percentage |
|----------|-------|-------------|------------|
| Entities | 20 | 20 | 100% |
| DTOs | 20 | 7 | 35% |
| Services | 20 | 6 | 30% |
| API Controllers | 20 | 7 | 35% |
| MVC Controllers | 3 | 3 | 100% |
| MVC Views | 3 | 3 | 100% (broken) |

### Layer Completion
| Layer | Status | Completion |
|-------|--------|------------|
| Domain Layer | ✅ Completed | 100% |
| Infrastructure Layer | ✅ Completed | 100% |
| Application Layer | ⚠️ In Progress | 35% |
| API Layer | ⚠️ In Progress | 35% |
| MVC Layer | ❌ Broken | 0% (views don't work) |
| Frontend Layer | ⚠️ In Progress | 40% |
| Testing Layer | ❌ Not Started | 0% |

### Code Quality Metrics
- **Test Coverage:** 0%
- **Authentication:** Temporary (header-based)
- **Error Handling:** Partial (no global handler)
- **Documentation:** Basic (README, guidelines)
- **Git Workflow:** Established (guidelines document)

---

## 🎯 Immediate Next Steps (This Week)

1. **Fix StaffDashboardViewModel**
   - Add: PendingOrders, InProgressOrders, CompletedToday, TotalLabTests
   - Add: PendingOrdersList, LabTestStats
   - Update StaffDashboardController to calculate these values

2. **Fix DoctorDashboardViewModel**
   - Add: TotalPatients, PendingAppointments, TodayResults, ActiveOrders
   - Add: RecentPatients, UpcomingAppointments
   - Update DoctorDashboardController to calculate these values

3. **Create OrderDetailDto**
   - Map to OrderDetail entity
   - Include all required properties

4. **Implement IOrderDetailService**
   - Define CRUD operations
   - Add query methods (GetByOrder, GetByLabTest)

5. **Implement OrderDetailService**
   - Implement CRUD with role-based logic
   - Implement query methods

6. **Create OrderDetailController**
   - REST API endpoints
   - Role-based authorization
   - Proper HTTP status codes

7. **Remove Result Module Temporary Workaround**
   - Re-enable OrderDetailID validation
   - Test with valid OrderDetail data

8. **Add Basic Unit Tests**
   - Test EmployeeService
   - Test OrderService
   - Test ResultService

---

## 📝 Recommendations

### For Development Team
1. **Follow Git Workflow Guidelines** - Prevent conflicts and lost work
2. **Use Feature Branches** - Keep main stable
3. **Write Clear Commit Messages** - Maintain history quality
4. **Test Before Pushing** - Prevent broken builds
5. **Communicate Changes** - Coordinate work to avoid conflicts

### For Project Management
1. **Prioritize Critical Fixes** - MVC views, OrderDetail service
2. **Implement Authentication** - Security before features
3. **Add Test Coverage** - Quality before quantity
4. **Connect Frontend** - Integration before new features
5. **Document APIs** - Swagger/OpenAPI specification

### For Architecture
1. **Maintain Clean Architecture** - Respect layer boundaries
2. **Use Dependency Injection** - Loose coupling
3. **Implement CQRS** - Separate read/write operations (future)
4. **Add Caching** - Performance optimization (future)
5. **Consider Event Sourcing** - Audit trail (future)

---

## 🚀 Conclusion

The Medixa-AI project has a solid architectural foundation with Clean Architecture properly implemented. The Domain and Infrastructure layers are production-ready. However, significant work remains in entity implementation, lifecycle management, MVC dashboard fixes, and frontend integration.

**Key Takeaways:**
- Strong foundation with proper architecture
- Critical issues need immediate attention (MVC views, OrderDetail)
- Authentication needs to be implemented properly
- Frontend integration is a major milestone
- Test coverage is essential for quality

**Next 30 Days Focus:**
1. Fix critical issues (MVC, OrderDetail)
2. Implement authentication
3. Connect frontend to backend
4. Add basic test coverage
5. Complete high-priority entities

With focused effort on these priorities, the project can reach a stable, production-ready state within 2-3 months.
