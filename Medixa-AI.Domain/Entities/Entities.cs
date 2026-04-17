using Medixa_AI.Domain.Enums;
namespace Medixa_AI.Domain.Entities

{
    // ─────────────────────────────────────────
    // 1. Specialization
    // ─────────────────────────────────────────
    public class Specialization
    {
        public int SpecializationID { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<Doctor> Doctors { get; set; } = new HashSet<Doctor>();
        public ICollection<TestMedicalRule> MedicalRules { get; set; } = new HashSet<TestMedicalRule>();
        public ICollection<AIInterpretation> AIInterpretations { get; set; } = new HashSet<AIInterpretation>();
    }

    // ─────────────────────────────────────────
    // 2. Doctor
    // ─────────────────────────────────────────
    public class Doctor
    {
        public Guid DoctorID { get; set; }
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int SpecializationID { get; set; }
        public string? ClinicName { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation
        public Specialization Specialization { get; set; } = null!;
        public ICollection<TestOrder> Orders { get; set; } = new HashSet<TestOrder>();
    }

    // ─────────────────────────────────────────
    // 3. Patient
    // ─────────────────────────────────────────
    public class Patient
    {
        public Guid PatientID { get; set; }
        public string FullName { get; set; } = null!;
        public string NationalID { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public Gender? Gender { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? BloodType { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<TestOrder> Orders { get; set; } = new HashSet<TestOrder>();
        public ICollection<CheckupRecommendation> CheckupRecommendations { get; set; } = new HashSet<CheckupRecommendation>();
        public ICollection<Appointment> Appointments { get; set; } = new HashSet<Appointment>();
        public ICollection<PatientMembership> Memberships { get; set; } = new HashSet<PatientMembership>();
        public ICollection<UploadedMedicalFile> UploadedFiles { get; set; } = new HashSet<UploadedMedicalFile>();
        public ICollection<HealthMetricSnapshot> HealthSnapshots { get; set; } = new HashSet<HealthMetricSnapshot>();
    }

    // ─────────────────────────────────────────
    // 4. Employee
    // ─────────────────────────────────────────
    public class Employee
    {
        public Guid EmployeeID { get; set; }
        public string FullName { get; set; } = null!;
        public EmployeeRole Role { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public decimal Salary { get; set; }
        public DateTime HireDate { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<TestOrder> CreatedOrders { get; set; } = new HashSet<TestOrder>();
        public ICollection<TestResult> Results { get; set; } = new HashSet<TestResult>();
    }

    // ─────────────────────────────────────────
    // 5. LabTest
    // ─────────────────────────────────────────
    public class LabTest
    {
        public Guid TestID { get; set; }
        public string TestName { get; set; } = null!;
        public string? Description { get; set; }
        public string? Category { get; set; }
        public decimal Price { get; set; }
        public string? SampleType { get; set; }
        public string? Unit { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<TestNormalRange> NormalRanges { get; set; } = new HashSet<TestNormalRange>();
        public ICollection<TestPrerequisite> Prerequisites { get; set; } = new HashSet<TestPrerequisite>();
        public ICollection<TestCheckupPolicy> CheckupPolicies { get; set; } = new HashSet<TestCheckupPolicy>();
        public ICollection<OrderDetail> OrderDetails { get; set; } = new HashSet<OrderDetail>();
        public ICollection<TestMedicalRule> MedicalRules { get; set; } = new HashSet<TestMedicalRule>();
        public ICollection<CheckupRecommendation> CheckupRecommendations { get; set; } = new HashSet<CheckupRecommendation>();
        public ICollection<HealthMetricSnapshot> HealthSnapshots { get; set; } = new HashSet<HealthMetricSnapshot>();
    }

    // ─────────────────────────────────────────
    // 6. TestNormalRange
    // ─────────────────────────────────────────
    public class TestNormalRange
    {
        public Guid RangeID { get; set; }
        public Guid TestID { get; set; }
        public Gender? Gender { get; set; }
        public int MinAge { get; set; }
        public int MaxAge { get; set; }
        public decimal MinValue { get; set; }
        public decimal MaxValue { get; set; }
        public string? Unit { get; set; }

        // Navigation
        public LabTest Test { get; set; } = null!;
    }

    // ─────────────────────────────────────────
    // 7. TestPrerequisite
    // ─────────────────────────────────────────
    public class TestPrerequisite
    {
        public Guid PrerequisiteID { get; set; }
        public Guid TestID { get; set; }
        public string InstructionText { get; set; } = null!;
        public int? FastingHours { get; set; }
        public bool IsMandatory { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public LabTest Test { get; set; } = null!;
    }

    // ─────────────────────────────────────────
    // 8. TestCheckupPolicy
    // ─────────────────────────────────────────
    public class TestCheckupPolicy
    {
        public Guid PolicyID { get; set; }
        public Guid TestID { get; set; }
        public int RecommendedEveryMonths { get; set; }
        public int? IsMandatoryForAgeAbove { get; set; }
        public Gender? IsMandatoryForGender { get; set; }
        public string? Notes { get; set; }

        // Navigation
        public LabTest Test { get; set; } = null!;
    }

    // ─────────────────────────────────────────
    // 9. TestOrder
    // ─────────────────────────────────────────
    public class TestOrder
    {
        public Guid OrderID { get; set; }
        public Guid PatientID { get; set; }
        public Guid? DoctorID { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string? Notes { get; set; }
        public Guid CreatedByEmployeeID { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Patient Patient { get; set; } = null!;
        public Doctor? Doctor { get; set; }
        public Employee CreatedByEmployee { get; set; } = null!;
        public ICollection<OrderDetail> OrderDetails { get; set; } = new HashSet<OrderDetail>();
        public Payment? Payment { get; set; }
    }

    // ─────────────────────────────────────────
    // 10. OrderDetail
    // ─────────────────────────────────────────
    public class OrderDetail
    {
        public Guid OrderDetailID { get; set; }
        public Guid OrderID { get; set; }
        public Guid TestID { get; set; }
        public decimal Price { get; set; }
        public TestStatus Status { get; set; } = TestStatus.Pending;
        public bool IsAbnormal { get; set; } = false;
        public DateTime? CompletedAt { get; set; }

        // Navigation
        public TestOrder Order { get; set; } = null!;
        public LabTest Test { get; set; } = null!;
        public TestResult? Result { get; set; }
    }

    // ─────────────────────────────────────────
    // 11. TestResult
    // ─────────────────────────────────────────
    public class TestResult
    {
        public Guid ResultID { get; set; }
        public Guid OrderDetailID { get; set; }
        public decimal ResultValue { get; set; }
        public string? ResultText { get; set; }
        public DateTime ResultDate { get; set; } = DateTime.UtcNow;
        public Guid TechnicianID { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public OrderDetail OrderDetail { get; set; } = null!;
        public Employee Technician { get; set; } = null!;
        public AIInterpretation? AIInterpretation { get; set; }
    }

    // ─────────────────────────────────────────
    // 12. TestMedicalRule
    // ─────────────────────────────────────────
    public class TestMedicalRule
    {
        public Guid RuleID { get; set; }
        public Guid TestID { get; set; }
        public Gender? Gender { get; set; }
        public int? MinAge { get; set; }
        public int? MaxAge { get; set; }
        public decimal MinValue { get; set; }
        public decimal MaxValue { get; set; }
        public RiskLevel RiskLevel { get; set; }
        public string AdviceText { get; set; } = null!;
        public int? SuggestedSpecializationID { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation
        public LabTest Test { get; set; } = null!;
        public Specialization? SuggestedSpecialization { get; set; }
    }

    // ─────────────────────────────────────────
    // 13. AIInterpretation
    // ─────────────────────────────────────────
    public class AIInterpretation
    {
        public Guid InterpretationID { get; set; }
        public Guid ResultID { get; set; }
        public RiskLevel RiskLevel { get; set; }
        public string SummaryText { get; set; } = null!;
        public int? SuggestedSpecializationID { get; set; }
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public TestResult Result { get; set; } = null!;
        public Specialization? SuggestedSpecialization { get; set; }
    }

    // ─────────────────────────────────────────
    // 14. CheckupRecommendation
    // ─────────────────────────────────────────
    public class CheckupRecommendation
    {
        public Guid RecommendationID { get; set; }
        public Guid PatientID { get; set; }
        public Guid? TestID { get; set; }
        public DateOnly SuggestedDate { get; set; }
        public string? Reason { get; set; }
        public RecommendationStatus Status { get; set; } = RecommendationStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Patient Patient { get; set; } = null!;
        public LabTest? Test { get; set; }
    }

    // ─────────────────────────────────────────
    // 15. Appointment
    // ─────────────────────────────────────────
    public class Appointment
    {
        public Guid AppointmentID { get; set; }
        public Guid PatientID { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Purpose { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
        public bool ReminderSent { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Patient Patient { get; set; } = null!;
    }

    // ─────────────────────────────────────────
    // 16. Payment
    // ─────────────────────────────────────────
    public class Payment
    {
        public Guid PaymentID { get; set; }
        public Guid OrderID { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public decimal AmountPaid { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        public string? TransactionReference { get; set; }

        // Navigation
        public TestOrder Order { get; set; } = null!;
    }

    // ─────────────────────────────────────────
    // 17. MembershipCategory
    // ─────────────────────────────────────────
    public class MembershipCategory
    {
        public Guid CategoryID { get; set; }
        public string CategoryName { get; set; } = null!;
        public decimal DiscountPercentage { get; set; }
        public decimal PointsMultiplier { get; set; }
        public string? Description { get; set; }

        // Navigation
        public ICollection<PatientMembership> PatientMemberships { get; set; } = new HashSet<PatientMembership>();
    }

    // ─────────────────────────────────────────
    // 18. PatientMembership
    // ─────────────────────────────────────────
    public class PatientMembership
    {
        public Guid MembershipID { get; set; }
        public Guid PatientID { get; set; }
        public Guid CategoryID { get; set; }
        public int PointsBalance { get; set; } = 0;
        public DateOnly StartDate { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation
        public Patient Patient { get; set; } = null!;
        public MembershipCategory Category { get; set; } = null!;
    }

    // ─────────────────────────────────────────
    // 19. UploadedMedicalFile
    // ─────────────────────────────────────────
    public class UploadedMedicalFile
    {
        public Guid FileID { get; set; }
        public Guid PatientID { get; set; }
        public string FileName { get; set; } = null!;
        public string FilePath { get; set; } = null!;
        public string? ExtractedText { get; set; }
        public bool Processed { get; set; } = false;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Patient Patient { get; set; } = null!;
    }

    // ─────────────────────────────────────────
    // 20. HealthMetricSnapshot
    // ─────────────────────────────────────────
    public class HealthMetricSnapshot
    {
        public Guid SnapshotID { get; set; }
        public Guid PatientID { get; set; }
        public Guid TestID { get; set; }
        public decimal LastValue { get; set; }
        public TrendType TrendType { get; set; }
        public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Patient Patient { get; set; } = null!;
        public LabTest Test { get; set; } = null!;
    }
}
