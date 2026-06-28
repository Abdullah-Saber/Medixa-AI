namespace Medixa_AI.Application.DTOs
{
    public class SpecializationDto
    {
        public int SpecializationID { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
