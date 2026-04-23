using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace patient_lifeCycle.Models
{
    public class TestResult
    {
        [Key]
        public Guid ResultID { get; set; }

        [Required]
        public Guid OrderDetailID { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ResultValue { get; set; }

        [StringLength(1000)]
        public string? ResultText { get; set; }

        public DateTime ResultDate { get; set; } = DateTime.UtcNow;

        [Required]
        public Guid TechnicianID { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public OrderDetail OrderDetail { get; set; } = null!;
        public Employee Technician { get; set; } = null!;
        public AIInterpretation? AIInterpretation { get; set; }
    }
}