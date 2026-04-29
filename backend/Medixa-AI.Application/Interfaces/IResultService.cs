using Medixa_AI.Application.DTOs;
using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.Interfaces
{
    public interface IResultService
    {
        Task<IEnumerable<ResultDto>> GetAllAsync();
        Task<ResultDto?> GetByIdAsync(Guid id);
        Task<ResultDto?> CreateAsync(ResultDto dto, EmployeeRole requesterRole);
        Task<bool> UpdateAsync(Guid id, ResultDto dto, EmployeeRole requesterRole);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<ResultDto>> GetByTechnicianAsync(Guid technicianId);
        Task<IEnumerable<ResultDto>> GetByOrderAsync(Guid orderId);
    }
}
