namespace Medixa_AI.Application.DTOs
{
    public class AIInterpretationDto
    {
        public int InterpretationID { get; set; }
        public int ResultID { get; set; }
        public string? Interpretation { get; set; }
        public string? RiskLevel { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class InterpretRequestDto
    {
        public List<int> ResultIDs { get; set; } = new();
        public Guid PatientID { get; set; }
    }

    public class TrendDto
    {
        public string TestName { get; set; } = string.Empty;
        public List<TrendDataPoint> DataPoints { get; set; } = new();
        public string? TrendType { get; set; }
    }

    public class TrendDataPoint
    {
        public DateTime Date { get; set; }
        public string Value { get; set; } = string.Empty;
        public string? Unit { get; set; }
    }

    public class RecommendationDto
    {
        public int RecommendationID { get; set; }
        public Guid PatientID { get; set; }
        public string? Recommendation { get; set; }
        public string? Category { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
