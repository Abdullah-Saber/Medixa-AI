using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace patient_lifeCycle.Models
{
    public class AIInterpretation
    {
        [Key]
        public Guid InterpretationID { get; set; }

        [Required]
        public Guid ResultID { get; set; }

        [Required]
        public RiskLevel RiskLevel { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 5)]
        public string SummaryText { get; set; } = null!;

        public int? SuggestedSpecializationID { get; set; }

        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public TestResult Result { get; set; } = null!;
        public Specialization? SuggestedSpecialization { get; set; }
    }
}