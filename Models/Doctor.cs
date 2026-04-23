using System.ComponentModel.DataAnnotations;

namespace patient_lifeCycle.Models
{
    public class Doctor
    {
        [Key]
        public Guid DoctorID { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string FullName { get; set; } = null!;

        [Phone]
        [StringLength(20)]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [Required]
        public int SpecializationID { get; set; }

        [StringLength(100)]
        public string? ClinicName { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public Specialization Specialization { get; set; } = null!;
        public ICollection<TestOrder> TestOrders { get; set; } = new HashSet<TestOrder>();
    }
}