using Medixa_AI.Application.DTOs;
using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetAllAsync();
        Task<EmployeeDto?> GetByIdAsync(Guid id);
        Task<EmployeeDto?> CreateAsync(EmployeeDto dto, EmployeeRole requesterRole);
        Task<bool> UpdateAsync(Guid id, EmployeeDto dto, EmployeeRole requesterRole);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> DeactivateAsync(Guid id, EmployeeRole requesterRole);
        Task<bool> ActivateAsync(Guid id, EmployeeRole requesterRole);
        Task<IEnumerable<EmployeeDto>> GetActiveEmployeesAsync();
        Task<IEnumerable<EmployeeDto>> GetByRoleAsync(EmployeeRole role);
    }
}
