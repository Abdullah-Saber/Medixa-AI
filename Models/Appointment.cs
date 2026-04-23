using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace patient_lifeCycle.Models
{
    public class Appointment
    {
        [Key]
        public Guid AppointmentID { get; set; }

        [Required]
        public Guid PatientID { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime AppointmentDate { get; set; }

        [StringLength(500)]
        public string? Purpose { get; set; }

        [Required]
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

        public bool ReminderSent { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Patient Patient { get; set; } = null!;
    }
}