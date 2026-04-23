using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace patient_lifeCycle.Models
{
    public class HealthMetricSnapshot
    {
        [Key]
        public Guid SnapshotID { get; set; }

        [Required]
        public Guid PatientID { get; set; }

        [Required]
        public Guid TestID { get; set; }

        [Required]
        [Range(0, 99999.99)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal LastValue { get; set; }

        [Required]
        public TrendType TrendType { get; set; }

        public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Patient Patient { get; set; } = null!;
        public LabTest Test { get; set; } = null!;
    }
}