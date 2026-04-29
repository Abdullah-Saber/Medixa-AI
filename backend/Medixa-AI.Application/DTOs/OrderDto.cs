using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.DTOs
{
    public class OrderDto
    {
        public Guid OrderID { get; set; }
        public Guid PatientID { get; set; }
        public Guid? DoctorID { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
        public string? Notes { get; set; }
        public Guid CreatedByEmployeeID { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
