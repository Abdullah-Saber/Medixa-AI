namespace Medixa_AI.Domain.Enums
{
    public enum Gender : byte
    {
        Male = 1,
        Female = 2,
        Other = 3
    }

    public enum OrderStatus : byte
    {
        Pending = 1,
        Completed = 2,
        Cancelled = 3
    }

    public enum TestStatus : byte
    {
        Pending = 1,
        Completed = 2
    }

    public enum AppointmentStatus : byte
    {
        Scheduled = 1,
        Completed = 2,
        Cancelled = 3,
        NoShow = 4
    }

    public enum RiskLevel : byte
    {
        Normal = 1,
        LowRisk = 2,
        MediumRisk = 3,
        HighRisk = 4
    }

    public enum PaymentMethod : byte
    {
        Cash = 1,
        Visa = 2,
        Insurance = 3
    }

    public enum PaymentStatus : byte
    {
        Pending = 1,
        Paid = 2,
        Refunded = 3,
        Failed = 4
    }

    public enum EmployeeRole : byte
    {
        Admin = 1,
        Technician = 2,
        Receptionist = 3
    }

    public enum TrendType : byte
    {
        Increasing = 1,
        Decreasing = 2,
        Stable = 3
    }

    public enum RecommendationStatus : byte
    {
        Pending = 1,
        Booked = 2,
        Ignored = 3
    }
}
