using Medixa_AI.Application.DTOs;

namespace Medixa_AI.Application.Interfaces
{
    public interface ISpecializationService
    {
        Task<IEnumerable<SpecializationDto>> GetAllAsync();
        Task<SpecializationDto?> GetByIdAsync(int id);
        Task<SpecializationDto> CreateAsync(SpecializationDto dto);
        Task<bool> UpdateAsync(int id, SpecializationDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
