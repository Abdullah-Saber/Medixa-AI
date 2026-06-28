using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.DTOs
{
    public class PatientRegisterDto
    {
        // Required fields per ERD
        public string FullName { get; set; } = string.Empty;
        public string NationalID { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        // Optional fields per ERD
        public string? Phone { get; set; }
        public Gender? Gender { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? BloodType { get; set; }
    }
}
