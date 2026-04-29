namespace Medixa_AI.Api.ViewModels
{
    public class StaffDashboardViewModel
    {
        public int PendingOrders { get; set; }
        public int InProgressOrders { get; set; }
        public int CompletedToday { get; set; }
        public int TotalLabTests { get; set; }
        public List<PendingOrder> PendingOrdersList { get; set; } = new();
        public List<LabTestStat> LabTestStats { get; set; } = new();
    }

    public class PendingOrder
    {
        public int OrderID { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public int TestCount { get; set; }
    }

    public class LabTestStat
    {
        public string TestName { get; set; } = string.Empty;
        public int TotalPerformed { get; set; }
        public int AverageTurnaround { get; set; } // in hours
    }
}
