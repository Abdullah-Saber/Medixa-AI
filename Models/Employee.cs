using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace patient_lifeCycle.Models
{
    public class Employee
    {
        [Key]
        public Guid EmployeeID { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string FullName { get; set; } = null!;

        [Required]
        public EmployeeRole Role { get; set; }

        [Phone]
        [StringLength(20)]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [Required]
        [Range(0, 99999.99)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Salary { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime HireDate { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<TestOrder> CreatedOrders { get; set; } = new HashSet<TestOrder>();
        public ICollection<TestResult> Results { get; set; } = new HashSet<TestResult>();
    }
}