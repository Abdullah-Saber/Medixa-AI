using System.ComponentModel.DataAnnotations;

namespace patient_lifeCycle.Models
{
    public class UploadedMedicalFile
    {
        [Key]
        public Guid FileID { get; set; }

        [Required]
        public Guid PatientID { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string FileName { get; set; } = null!;

        [Required]
        [StringLength(500)]
        public string FilePath { get; set; } = null!;

        public string? ExtractedText { get; set; }

        public bool Processed { get; set; } = false;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Patient Patient { get; set; } = null!;
    }
}