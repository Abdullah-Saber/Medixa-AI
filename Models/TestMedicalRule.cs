using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace patient_lifeCycle.Models
{
    public class TestMedicalRule
    {
        [Key]
        public Guid RuleID { get; set; }

        [Required]
        public Guid TestID { get; set; }

        public Gender? Gender { get; set; }

        [Range(0, 120)]
        public int? MinAge { get; set; }

        [Range(0, 120)]
        public int? MaxAge { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MinValue { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MaxValue { get; set; }

        [Required]
        public RiskLevel RiskLevel { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 5)]
        public string AdviceText { get; set; } = null!;

        public int? SuggestedSpecializationID { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public LabTest Test { get; set; } = null!;
        public Specialization? SuggestedSpecialization { get; set; }
    }
}