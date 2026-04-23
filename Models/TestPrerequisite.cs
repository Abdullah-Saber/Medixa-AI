using System.ComponentModel.DataAnnotations;

namespace patient_lifeCycle.Models
{
    public class TestPrerequisite
    {
        [Key]
        public Guid PrerequisiteID { get; set; }

        [Required]
        public Guid TestID { get; set; }

        [Required]
        [StringLength(500, MinimumLength = 5)]
        public string InstructionText { get; set; } = null!;

        [Range(0, 72)]
        public int? FastingHours { get; set; }

        public bool IsMandatory { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public LabTest Test { get; set; } = null!;
    }
}