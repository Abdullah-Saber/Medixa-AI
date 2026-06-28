using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.DTOs
{
    public class PatientDto
    {
        public Guid PatientID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string NationalID { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public Gender? Gender { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? BloodType { get; set; }
        public DateTime RegistrationDate { get; set; }
        public bool IsActive { get; set; }
    }
}
