using Medixa_AI.Application.DTOs;

namespace Medixa_AI.Application.Interfaces
{
    public interface ILabTestService
    {
        Task<IEnumerable<LabTestDto>> GetAllAsync();
        Task<LabTestDto?> GetByIdAsync(Guid id);
        Task<LabTestDto?> CreateAsync(LabTestDto dto);
        Task<bool> UpdateAsync(Guid id, LabTestDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<LabTestDto>> GetByCategoryAsync(string category);
    }
}
