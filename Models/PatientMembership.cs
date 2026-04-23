using System.ComponentModel.DataAnnotations;

namespace patient_lifeCycle.Models
{
    public class PatientMembership
    {
        [Key]
        public Guid MembershipID { get; set; }

        [Required]
        public Guid PatientID { get; set; }

        [Required]
        public Guid CategoryID { get; set; }

        [Range(0, int.MaxValue)]
        public int PointsBalance { get; set; } = 0;

        [Required]
        [DataType(DataType.Date)]
        public DateOnly StartDate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateOnly ExpiryDate { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public Patient Patient { get; set; } = null!;
        public MembershipCategory Category { get; set; } = null!;
    }
}