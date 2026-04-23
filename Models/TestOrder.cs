using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace patient_lifeCycle.Models
{
    public class TestOrder
    {
        [Key]
        public Guid OrderID { get; set; }

        [Required]
        public Guid PatientID { get; set; }

        public Guid? DoctorID { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Required]
        [Range(0, 99999.99)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [StringLength(500)]
        public string? Notes { get; set; }

        [Required]
        public Guid CreatedByEmployeeID { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Patient Patient { get; set; } = null!;
        public Doctor? Doctor { get; set; }
        public Employee CreatedByEmployee { get; set; } = null!;
        public ICollection<OrderDetail> OrderDetails { get; set; } = new HashSet<OrderDetail>();
        public Payment? Payment { get; set; }
    }
}