using Medixa_AI.Application.DTOs;

namespace Medixa_AI.Application.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentDto>> GetAllAsync();
        Task<AppointmentDto?> GetByIdAsync(Guid id);
        Task<AppointmentDto> CreateAsync(AppointmentDto dto);
        Task<bool> UpdateAsync(Guid id, AppointmentDto dto);
        Task<bool> CancelAsync(Guid id);
        Task<bool> CompleteAsync(Guid id);
        Task<IEnumerable<AppointmentDto>> GetByPatientAsync(Guid patientId);
        Task<IEnumerable<AppointmentDto>> GetByDoctorAsync(Guid doctorId);
    }
}