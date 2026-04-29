using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.DTOs
{
    public class EmployeeDto
    {
        public Guid EmployeeID { get; set; }
        public string FullName { get; set; } = null!;
        public EmployeeRole Role { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public decimal Salary { get; set; }
        public DateTime HireDate { get; set; }
        public bool IsActive { get; set; }
    }
}
