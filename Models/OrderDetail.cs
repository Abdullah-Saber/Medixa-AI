using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace patient_lifeCycle.Models
{
    public class OrderDetail
    {
        [Key]
        public Guid OrderDetailID { get; set; }

        [Required]
        public Guid OrderID { get; set; }

        [Required]
        public Guid TestID { get; set; }

        [Required]
        [Range(0, 99999.99)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        public TestStatus Status { get; set; } = TestStatus.Pending;

        public bool IsAbnormal { get; set; } = false;

        public DateTime? CompletedAt { get; set; }

        // Navigation
        public TestOrder Order { get; set; } = null!;
        public LabTest Test { get; set; } = null!;
        public TestResult? Result { get; set; }
    }
}