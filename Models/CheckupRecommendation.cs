using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace patient_lifeCycle.Models
{
    public class CheckupRecommendation
    {
        [Key]
        public Guid RecommendationID { get; set; }

        [Required]
        public Guid PatientID { get; set; }

        public Guid? TestID { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateOnly SuggestedDate { get; set; }

        [StringLength(500)]
        public string? Reason { get; set; }

        [Required]
        public RecommendationStatus Status { get; set; } = RecommendationStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Patient Patient { get; set; } = null!;
        public LabTest? Test { get; set; }
    }
}