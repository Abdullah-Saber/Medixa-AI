using Medixa_AI.Application.DTOs;
using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetAllAsync();
        Task<OrderDto?> GetByIdAsync(Guid id);
        Task<OrderDto?> CreateAsync(OrderDto dto, EmployeeRole requesterRole);
        Task<bool> UpdateAsync(Guid id, OrderDto dto, EmployeeRole requesterRole);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<OrderDto>> GetByPatientAsync(Guid patientId);
        Task<IEnumerable<OrderDto>> GetByTechnicianAsync(Guid technicianId);
    }
}
