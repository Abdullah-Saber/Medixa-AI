using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.DTOs
{
    public class AppointmentDto
    {
        public Guid AppointmentID { get; set; }
        public Guid PatientID { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Purpose { get; set; }
        public AppointmentStatus Status { get; set; }
        public bool ReminderSent { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}