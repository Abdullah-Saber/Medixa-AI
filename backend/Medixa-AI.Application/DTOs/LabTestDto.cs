namespace Medixa_AI.Application.DTOs
{
    public class LabTestDto
    {
        public Guid TestID { get; set; }
        public string TestName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Category { get; set; }
        public decimal Price { get; set; }
        public string? SampleType { get; set; }
        public string? Unit { get; set; }
        public bool IsActive { get; set; }
    }
}
