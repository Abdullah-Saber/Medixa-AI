namespace Medixa_AI.Api.ViewModels
{
    public class PatientDashboardViewModel
    {
        public Guid PatientID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int TotalOrders { get; set; }
        public int PendingResults { get; set; }
        public int CompletedResults { get; set; }
        public List<RecentOrder> RecentOrders { get; set; } = new();
        public List<HealthAlert> HealthAlerts { get; set; } = new();
    }

    public class RecentOrder
    {
        public int OrderID { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public int TestCount { get; set; }
    }

    public class HealthAlert
    {
        public string Type { get; set; } = string.Empty; // "AbnormalResult", "Recommendation", "Trend"
        public string Message { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Severity { get; set; } // "Low", "Medium", "High"
    }
}
