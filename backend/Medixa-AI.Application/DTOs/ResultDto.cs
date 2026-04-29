using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.DTOs
{
    public class ResultDto
    {
        public Guid ResultID { get; set; }
        public Guid OrderDetailID { get; set; }
        public decimal ResultValue { get; set; }
        public string? ResultText { get; set; }
        public DateTime ResultDate { get; set; }
        public Guid TechnicianID { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
