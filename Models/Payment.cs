using patient_lifeCycle.Enums.Medixa_AI.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace patient_lifeCycle.Models
{
    public class Payment
    {
        [Key]
        public Guid PaymentID { get; set; }

        [Required]
        public Guid OrderID { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        [Required]
        [Range(0, 99999.99)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountPaid { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        [Required]
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

        [StringLength(100)]
        public string? TransactionReference { get; set; }

        // Navigation
        public TestOrder Order { get; set; } = null!;
    }
}