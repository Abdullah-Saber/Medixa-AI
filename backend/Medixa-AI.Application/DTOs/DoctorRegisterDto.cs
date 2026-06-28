namespace Medixa_AI.Application.DTOs
{
    public class DoctorRegisterDto
    {
        // Required fields per ERD
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int SpecializationID { get; set; }

        // Optional fields per ERD
        public string? Phone { get; set; }
        public string? ClinicName { get; set; }
    }
}
