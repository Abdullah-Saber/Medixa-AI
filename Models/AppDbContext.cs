using Microsoft.EntityFrameworkCore;
using patient_lifeCycle.Models;

namespace patient_lifeCycle.models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Tables (DbSet)
   

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Specialization> Specializations { get; set; }

        public DbSet<LabTest> LabTests { get; set; }
        public DbSet<TestNormalRange> TestNormalRanges { get; set; }
        public DbSet<TestMedicalRule> TestMedicalRules { get; set; }
        public DbSet<TestPrerequisite> TestPrerequisites { get; set; }
        public DbSet<TestCheckupPolicy> TestCheckupPolicies { get; set; }

        public DbSet<TestOrder> TestOrders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<TestResult> TestResults { get; set; }

        public DbSet<AIInterpretation> AIInterpretations { get; set; }

        public DbSet<Payment> Payments { get; set; }

        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<CheckupRecommendation> CheckupRecommendations { get; set; }

        public DbSet<HealthMetricSnapshot> HealthMetricSnapshots { get; set; }

        public DbSet<MembershipCategory> MembershipCategories { get; set; }
        public DbSet<PatientMembership> PatientMemberships { get; set; }

        public DbSet<UploadedMedicalFile> UploadedMedicalFiles { get; set; }

         
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // ENUMS ->  as a STRING
            // =========================

            modelBuilder.Entity<Patient>()
                .Property(p => p.Gender)
                .HasConversion<string>();

            modelBuilder.Entity<TestOrder>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<OrderDetail>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Appointment>()
                .Property(a => a.Status)
                .HasConversion<string>();

            modelBuilder.Entity<TestMedicalRule>()
                .Property(r => r.RiskLevel)
                .HasConversion<string>();

            modelBuilder.Entity<AIInterpretation>()
                .Property(a => a.RiskLevel)
                .HasConversion<string>();

            modelBuilder.Entity<Payment>()
                .Property(p => p.PaymentMethod)
                .HasConversion<string>();

            modelBuilder.Entity<Payment>()
                .Property(p => p.PaymentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<Employee>()
                .Property(e => e.Role)
                .HasConversion<string>();

            modelBuilder.Entity<HealthMetricSnapshot>()
                .Property(h => h.TrendType)
                .HasConversion<string>();

            modelBuilder.Entity<CheckupRecommendation>()
                .Property(c => c.Status)
                .HasConversion<string>();


            modelBuilder.Entity<Patient>()
                .HasIndex(p => p.NationalID)
                .IsUnique();
             
            // One-to-Many
            // =========================

            modelBuilder.Entity<TestOrder>()
                .HasOne(o => o.Patient)
                .WithMany(p => p.Orders)
                .HasForeignKey(o => o.PatientID)
                .OnDelete(DeleteBehavior.Restrict);

           
               
            modelBuilder.Entity<TestOrder>()
   
                .HasOne(o => o.Doctor)
    
                .WithMany(d => d.TestOrders)
    
                .HasForeignKey(o => o.DoctorID)
    
                .OnDelete(DeleteBehavior.SetNull);

     


            modelBuilder.Entity<TestOrder>()
                .HasOne(o => o.CreatedByEmployee)
                .WithMany(e => e.CreatedOrders)
                .HasForeignKey(o => o.CreatedByEmployeeID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(d => d.Order)
                .WithMany(o => o.OrderDetails)
                .HasForeignKey(d => d.OrderID);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(d => d.Test)
                .WithMany(t => t.OrderDetails)
                .HasForeignKey(d => d.TestID);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientID);

            modelBuilder.Entity<CheckupRecommendation>()
                .HasOne(c => c.Patient)
                .WithMany(p => p.CheckupRecommendations)
                .HasForeignKey(c => c.PatientID);

            modelBuilder.Entity<CheckupRecommendation>()
                .HasOne(c => c.Test)
                .WithMany(t => t.CheckupRecommendations)
                .HasForeignKey(c => c.TestID);

            modelBuilder.Entity<HealthMetricSnapshot>()
                .HasOne(h => h.Patient)
                .WithMany(p => p.HealthSnapshots)
                .HasForeignKey(h => h.PatientID);

            modelBuilder.Entity<HealthMetricSnapshot>()
                .HasOne(h => h.Test)
                .WithMany(t => t.HealthSnapshots)
                .HasForeignKey(h => h.TestID);

            modelBuilder.Entity<TestMedicalRule>()
                .HasOne(r => r.Test)
                .WithMany(t => t.MedicalRules)
                .HasForeignKey(r => r.TestID);

            modelBuilder.Entity<TestMedicalRule>()
                .HasOne(r => r.SuggestedSpecialization)
                .WithMany(s => s.MedicalRules)
                .HasForeignKey(r => r.SuggestedSpecializationID);

            modelBuilder.Entity<TestCheckupPolicy>()
                .HasOne(p => p.Test)
                .WithMany(t => t.CheckupPolicies)
                .HasForeignKey(p => p.TestID);

            modelBuilder.Entity<TestPrerequisite>()
                .HasOne(p => p.Test)
                .WithMany(t => t.Prerequisites)
                .HasForeignKey(p => p.TestID);

            modelBuilder.Entity<TestNormalRange>()
                .HasOne(r => r.Test)
                .WithMany(t => t.NormalRanges)
                .HasForeignKey(r => r.TestID);
             
            // One-to-One
            // =========================

            modelBuilder.Entity<TestResult>()
                .HasOne(r => r.OrderDetail)
                .WithOne(d => d.Result)
                .HasForeignKey<TestResult>(r => r.OrderDetailID);

            modelBuilder.Entity<AIInterpretation>()
                .HasOne(ai => ai.Result)
                .WithOne(r => r.AIInterpretation)
                .HasForeignKey<AIInterpretation>(ai => ai.ResultID);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Order)
                .WithOne(o => o.Payment)
                .HasForeignKey<Payment>(p => p.OrderID);
 
            // Many-to-Many 
            // =========================

            modelBuilder.Entity<PatientMembership>()
                .HasOne(pm => pm.Patient)
                .WithMany(p => p.Memberships)
                .HasForeignKey(pm => pm.PatientID);

            modelBuilder.Entity<PatientMembership>()
                .HasOne(pm => pm.Category)
                .WithMany(c => c.PatientMemberships)
                .HasForeignKey(pm => pm.CategoryID);
        }
    }
}