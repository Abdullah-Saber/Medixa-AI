using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace patient_lifeCycle.Models
{
    public class Patient
    {
        [Key]
        public Guid PatientID { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string FullName { get; set; } = null!;

        [Required]
        [StringLength(14, MinimumLength = 14)]
        public string NationalID { get; set; } = null!;

        [Phone]
        [StringLength(20)]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        public Gender? Gender { get; set; }

        [DataType(DataType.Date)]
        public DateOnly? DateOfBirth { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }

        [StringLength(5)]
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
}