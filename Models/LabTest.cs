using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace patient_lifeCycle.Models
{
    public class LabTest
    {
        [Key]
        public Guid TestID { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string TestName { get; set; } = null!;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? Category { get; set; }

        [Required]
        [Range(0, 99999.99)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [StringLength(100)]
        public string? SampleType { get; set; }

        [StringLength(50)]
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
}