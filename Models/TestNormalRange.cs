using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace patient_lifeCycle.Models
{
    public class TestNormalRange
    {
        [Key]
        public Guid RangeID { get; set; }

        [Required]
        public Guid TestID { get; set; }

        public Gender? Gender { get; set; }

        [Required]
        [Range(0, 120)]
        public int MinAge { get; set; }

        [Required]
        [Range(0, 120)]
        public int MaxAge { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MinValue { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MaxValue { get; set; }

        [StringLength(50)]
        public string? Unit { get; set; }

        // Navigation
        public LabTest Test { get; set; } = null!;
    }
}