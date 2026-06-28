namespace Medixa_AI.Application.DTOs
{
    public class LabTestStatDto
    {
        public string TestName { get; set; } = string.Empty;
        public int TotalPerformed { get; set; }
        public int AverageTurnaround { get; set; } // in hours
    }
}
