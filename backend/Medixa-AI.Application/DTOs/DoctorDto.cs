namespace Medixa_AI.Application.DTOs
{
    public class DoctorDto
    {
        public Guid DoctorID { get; set; }
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int SpecializationID { get; set; }
        public string? ClinicName { get; set; }
        public bool IsActive { get; set; }
    }
}
