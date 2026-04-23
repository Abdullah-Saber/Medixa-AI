using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace patient_lifeCycle.Models
{
    public class TestCheckupPolicy
    {
        [Key]
        public Guid PolicyID { get; set; }

        [Required]
        public Guid TestID { get; set; }

        [Required]
        [Range(1, 120)]
        public int RecommendedEveryMonths { get; set; }

        [Range(0, 120)]
        public int? IsMandatoryForAgeAbove { get; set; }

        public Gender? IsMandatoryForGender { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        // Navigation
        public LabTest Test { get; set; } = null!;
    }
}