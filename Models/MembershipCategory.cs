using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace patient_lifeCycle.Models
{
    public class MembershipCategory
    {
        [Key]
        public Guid CategoryID { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string CategoryName { get; set; } = null!;

        [Required]
        [Range(0, 100)]
        [Column(TypeName = "decimal(5,2)")]
        public decimal DiscountPercentage { get; set; }

        [Required]
        [Range(1, 10)]
        [Column(TypeName = "decimal(5,2)")]
        public decimal PointsMultiplier { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        // Navigation
        public ICollection<PatientMembership> PatientMemberships { get; set; } = new HashSet<PatientMembership>();
    }
}