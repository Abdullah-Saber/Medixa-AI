namespace Medixa_AI.Api.ViewModels
{
    public class DoctorDashboardViewModel
    {
        public int TotalPatients { get; set; }
        public int PendingAppointments { get; set; }
        public int TodayResults { get; set; }
        public int ActiveOrders { get; set; }
        public List<RecentPatient> RecentPatients { get; set; } = new();
        public List<UpcomingAppointment> UpcomingAppointments { get; set; } = new();
    }

    public class RecentPatient
    {
        public Guid PatientID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public DateTime LastVisit { get; set; }
    }

    public class UpcomingAppointment
    {
        public int AppointmentID { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
