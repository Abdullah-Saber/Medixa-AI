using Microsoft.EntityFrameworkCore;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // ── DbSets ──────────────────────────────────────────────────────────
        public DbSet<Patient> Patients => Set<Patient>();
        public DbSet<Doctor> Doctors => Set<Doctor>();
        public DbSet<Specialization> Specializations => Set<Specialization>();
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<LabTest> LabTests => Set<LabTest>();
        public DbSet<TestNormalRange> TestNormalRanges => Set<TestNormalRange>();
        public DbSet<TestPrerequisite> TestPrerequisites => Set<TestPrerequisite>();
        public DbSet<TestCheckupPolicy> TestCheckupPolicies => Set<TestCheckupPolicy>();
        public DbSet<TestOrder> TestOrders => Set<TestOrder>();
        public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
        public DbSet<TestResult> TestResults => Set<TestResult>();
        public DbSet<TestMedicalRule> TestMedicalRules => Set<TestMedicalRule>();
        public DbSet<AIInterpretation> AIInterpretations => Set<AIInterpretation>();
        public DbSet<CheckupRecommendation> CheckupRecommendations => Set<CheckupRecommendation>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<MembershipCategory> MembershipCategories => Set<MembershipCategory>();
        public DbSet<PatientMembership> PatientMemberships => Set<PatientMembership>();
        public DbSet<UploadedMedicalFile> UploadedMedicalFiles => Set<UploadedMedicalFile>();
        public DbSet<HealthMetricSnapshot> HealthMetricSnapshots => Set<HealthMetricSnapshot>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Specialization ───────────────────────────────────────────────
            modelBuilder.Entity<Specialization>(e =>
            {
                e.HasKey(x => x.SpecializationID);
                e.Property(x => x.Name).HasMaxLength(100).IsRequired();
                e.Property(x => x.Description).HasMaxLength(500);
            });

            // ── Doctor ───────────────────────────────────────────────────────
            modelBuilder.Entity<Doctor>(e =>
            {
                e.HasKey(x => x.DoctorID);
                e.Property(x => x.DoctorID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.FullName).HasMaxLength(150).IsRequired();
                e.Property(x => x.Phone).HasMaxLength(20);
                e.Property(x => x.Email).HasMaxLength(150);
                e.Property(x => x.ClinicName).HasMaxLength(200);

                e.HasOne(d => d.Specialization)
                    .WithMany(s => s.Doctors)
                    .HasForeignKey(d => d.SpecializationID)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ── Patient ──────────────────────────────────────────────────────
            modelBuilder.Entity<Patient>(e =>
            {
                e.HasKey(x => x.PatientID);
                e.Property(x => x.PatientID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.FullName).HasMaxLength(150).IsRequired();
                e.Property(x => x.NationalID).HasMaxLength(20).IsRequired();
                e.Property(x => x.Phone).HasMaxLength(20);
                e.Property(x => x.Email).HasMaxLength(150);
                e.Property(x => x.Address).HasMaxLength(300);
                e.Property(x => x.BloodType).HasMaxLength(5);
                e.Property(x => x.Gender).HasConversion<byte>();

                e.HasIndex(x => x.NationalID).IsUnique();
                e.HasIndex(x => x.Phone);
            });

            // ── Employee ─────────────────────────────────────────────────────
            modelBuilder.Entity<Employee>(e =>
            {
                e.HasKey(x => x.EmployeeID);
                e.Property(x => x.EmployeeID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.FullName).HasMaxLength(150).IsRequired();
                e.Property(x => x.Phone).HasMaxLength(20);
                e.Property(x => x.Email).HasMaxLength(150);
                e.Property(x => x.Salary).HasPrecision(18, 2);
                e.Property(x => x.Role).HasConversion<byte>();
            });

            // ── LabTest ──────────────────────────────────────────────────────
            modelBuilder.Entity<LabTest>(e =>
            {
                e.HasKey(x => x.TestID);
                e.Property(x => x.TestID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.TestName).HasMaxLength(150).IsRequired();
                e.Property(x => x.Description).HasMaxLength(1000);
                e.Property(x => x.Category).HasMaxLength(100);
                e.Property(x => x.Price).HasPrecision(18, 2);
                e.Property(x => x.SampleType).HasMaxLength(50);
                e.Property(x => x.Unit).HasMaxLength(50);
            });

            // ── TestNormalRange ──────────────────────────────────────────────
            modelBuilder.Entity<TestNormalRange>(e =>
            {
                e.HasKey(x => x.RangeID);
                e.Property(x => x.RangeID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.MinValue).HasPrecision(18, 4);
                e.Property(x => x.MaxValue).HasPrecision(18, 4);
                e.Property(x => x.Unit).HasMaxLength(50);
                e.Property(x => x.Gender).HasConversion<byte?>();

                e.HasOne(r => r.Test)
                    .WithMany(t => t.NormalRanges)
                    .HasForeignKey(r => r.TestID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── TestPrerequisite ─────────────────────────────────────────────
            modelBuilder.Entity<TestPrerequisite>(e =>
            {
                e.HasKey(x => x.PrerequisiteID);
                e.Property(x => x.PrerequisiteID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.InstructionText).HasMaxLength(500).IsRequired();

                e.HasOne(p => p.Test)
                    .WithMany(t => t.Prerequisites)
                    .HasForeignKey(p => p.TestID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── TestCheckupPolicy ────────────────────────────────────────────
            modelBuilder.Entity<TestCheckupPolicy>(e =>
            {
                e.HasKey(x => x.PolicyID);
                e.Property(x => x.PolicyID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.Notes).HasMaxLength(500);
                e.Property(x => x.IsMandatoryForGender).HasConversion<byte?>();

                e.HasOne(p => p.Test)
                    .WithMany(t => t.CheckupPolicies)
                    .HasForeignKey(p => p.TestID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── TestOrder ────────────────────────────────────────────────────
            modelBuilder.Entity<TestOrder>(e =>
            {
                e.HasKey(x => x.OrderID);
                e.Property(x => x.OrderID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.TotalAmount).HasPrecision(18, 2);
                e.Property(x => x.Notes).HasMaxLength(500);
                e.Property(x => x.Status).HasConversion<byte>();

                e.HasOne(o => o.Patient)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(o => o.PatientID)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(o => o.Doctor)
                    .WithMany(d => d.Orders)
                    .HasForeignKey(o => o.DoctorID)
                    .OnDelete(DeleteBehavior.SetNull)
                    .IsRequired(false);

                e.HasOne(o => o.CreatedByEmployee)
                    .WithMany(emp => emp.CreatedOrders)
                    .HasForeignKey(o => o.CreatedByEmployeeID)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasIndex(x => x.PatientID);
            });

            // ── OrderDetail ──────────────────────────────────────────────────
            modelBuilder.Entity<OrderDetail>(e =>
            {
                e.HasKey(x => x.OrderDetailID);
                e.Property(x => x.OrderDetailID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.Price).HasPrecision(18, 2);
                e.Property(x => x.Status).HasConversion<byte>();

                e.HasOne(od => od.Order)
                    .WithMany(o => o.OrderDetails)
                    .HasForeignKey(od => od.OrderID)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(od => od.Test)
                    .WithMany(t => t.OrderDetails)
                    .HasForeignKey(od => od.TestID)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasIndex(x => x.OrderID);
            });

            // ── TestResult ───────────────────────────────────────────────────
            modelBuilder.Entity<TestResult>(e =>
            {
                e.HasKey(x => x.ResultID);
                e.Property(x => x.ResultID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.ResultValue).HasPrecision(18, 4);
                e.Property(x => x.ResultText).HasMaxLength(500);
                e.Property(x => x.Notes).HasMaxLength(500);

                // One-to-One: OrderDetail → TestResult
                e.HasOne(r => r.OrderDetail)
                    .WithOne(od => od.Result)
                    .HasForeignKey<TestResult>(r => r.OrderDetailID)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(r => r.Technician)
                    .WithMany(emp => emp.Results)
                    .HasForeignKey(r => r.TechnicianID)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasIndex(x => x.OrderDetailID).IsUnique();
            });

            // ── TestMedicalRule ──────────────────────────────────────────────
            modelBuilder.Entity<TestMedicalRule>(e =>
            {
                e.HasKey(x => x.RuleID);
                e.Property(x => x.RuleID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.MinValue).HasPrecision(18, 4);
                e.Property(x => x.MaxValue).HasPrecision(18, 4);
                e.Property(x => x.AdviceText).HasMaxLength(1000).IsRequired();
                e.Property(x => x.RiskLevel).HasConversion<byte>();
                e.Property(x => x.Gender).HasConversion<byte?>();

                e.HasOne(r => r.Test)
                    .WithMany(t => t.MedicalRules)
                    .HasForeignKey(r => r.TestID)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(r => r.SuggestedSpecialization)
                    .WithMany(s => s.MedicalRules)
                    .HasForeignKey(r => r.SuggestedSpecializationID)
                    .OnDelete(DeleteBehavior.SetNull)
                    .IsRequired(false);
            });

            // ── AIInterpretation ─────────────────────────────────────────────
            modelBuilder.Entity<AIInterpretation>(e =>
            {
                e.HasKey(x => x.InterpretationID);
                e.Property(x => x.InterpretationID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.SummaryText).HasMaxLength(1500).IsRequired();
                e.Property(x => x.RiskLevel).HasConversion<byte>();

                // One-to-One: TestResult → AIInterpretation
                e.HasOne(ai => ai.Result)
                    .WithOne(r => r.AIInterpretation)
                    .HasForeignKey<AIInterpretation>(ai => ai.ResultID)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(ai => ai.SuggestedSpecialization)
                    .WithMany(s => s.AIInterpretations)
                    .HasForeignKey(ai => ai.SuggestedSpecializationID)
                    .OnDelete(DeleteBehavior.SetNull)
                    .IsRequired(false);
            });

            // ── CheckupRecommendation ────────────────────────────────────────
            modelBuilder.Entity<CheckupRecommendation>(e =>
            {
                e.HasKey(x => x.RecommendationID);
                e.Property(x => x.RecommendationID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.Reason).HasMaxLength(1000);
                e.Property(x => x.Status).HasConversion<byte>();

                e.HasOne(r => r.Patient)
                    .WithMany(p => p.CheckupRecommendations)
                    .HasForeignKey(r => r.PatientID)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(r => r.Test)
                    .WithMany(t => t.CheckupRecommendations)
                    .HasForeignKey(r => r.TestID)
                    .OnDelete(DeleteBehavior.SetNull)
                    .IsRequired(false);
            });

            // ── Appointment ──────────────────────────────────────────────────
            modelBuilder.Entity<Appointment>(e =>
            {
                e.HasKey(x => x.AppointmentID);
                e.Property(x => x.AppointmentID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.Purpose).HasMaxLength(200);
                e.Property(x => x.Status).HasConversion<byte>();

                e.HasOne(a => a.Patient)
                    .WithMany(p => p.Appointments)
                    .HasForeignKey(a => a.PatientID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── Payment ──────────────────────────────────────────────────────
            modelBuilder.Entity<Payment>(e =>
            {
                e.HasKey(x => x.PaymentID);
                e.Property(x => x.PaymentID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.AmountPaid).HasPrecision(18, 2);
                e.Property(x => x.TransactionReference).HasMaxLength(100);
                e.Property(x => x.PaymentMethod).HasConversion<byte>();
                e.Property(x => x.PaymentStatus).HasConversion<byte>();

                // One-to-One: TestOrder → Payment
                e.HasOne(p => p.Order)
                    .WithOne(o => o.Payment)
                    .HasForeignKey<Payment>(p => p.OrderID)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ── MembershipCategory ───────────────────────────────────────────
            modelBuilder.Entity<MembershipCategory>(e =>
            {
                e.HasKey(x => x.CategoryID);
                e.Property(x => x.CategoryID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.CategoryName).HasMaxLength(100).IsRequired();
                e.Property(x => x.DiscountPercentage).HasPrecision(5, 2);
                e.Property(x => x.PointsMultiplier).HasPrecision(5, 2);
                e.Property(x => x.Description).HasMaxLength(500);
            });

            // ── PatientMembership ────────────────────────────────────────────
            modelBuilder.Entity<PatientMembership>(e =>
            {
                e.HasKey(x => x.MembershipID);
                e.Property(x => x.MembershipID).HasDefaultValueSql("NEWSEQUENTIALID()");

                e.HasOne(m => m.Patient)
                    .WithMany(p => p.Memberships)
                    .HasForeignKey(m => m.PatientID)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(m => m.Category)
                    .WithMany(c => c.PatientMemberships)
                    .HasForeignKey(m => m.CategoryID)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ── UploadedMedicalFile ──────────────────────────────────────────
            modelBuilder.Entity<UploadedMedicalFile>(e =>
            {
                e.HasKey(x => x.FileID);
                e.Property(x => x.FileID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.FileName).HasMaxLength(200).IsRequired();
                e.Property(x => x.FilePath).HasMaxLength(500).IsRequired();
                e.Property(x => x.ExtractedText).HasColumnType("nvarchar(max)");

                e.HasOne(f => f.Patient)
                    .WithMany(p => p.UploadedFiles)
                    .HasForeignKey(f => f.PatientID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── HealthMetricSnapshot ─────────────────────────────────────────
            modelBuilder.Entity<HealthMetricSnapshot>(e =>
            {
                e.HasKey(x => x.SnapshotID);
                e.Property(x => x.SnapshotID).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.LastValue).HasPrecision(18, 4);
                e.Property(x => x.TrendType).HasConversion<byte>();

                e.HasOne(s => s.Patient)
                    .WithMany(p => p.HealthSnapshots)
                    .HasForeignKey(s => s.PatientID)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(s => s.Test)
                    .WithMany(t => t.HealthSnapshots)
                    .HasForeignKey(s => s.TestID)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
