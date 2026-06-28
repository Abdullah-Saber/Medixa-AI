using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public EmployeeRole Role { get; set; }
    }
}
