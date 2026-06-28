using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.DTOs
{
    public class OrderDetailDto
    {
        public Guid OrderDetailID { get; set; }
        public Guid OrderID { get; set; }
        public Guid TestID { get; set; }
        public decimal Price { get; set; }
        public TestStatus Status { get; set; }
        public bool IsAbnormal { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
