using Medixa_AI.Application.DTOs;

namespace Medixa_AI.Application.Interfaces
{
    public interface IDoctorService
    {
        Task<IEnumerable<DoctorDto>> GetAllAsync();
        Task<DoctorDto?> GetByIdAsync(Guid id);
        Task<DoctorDto> CreateAsync(DoctorDto dto);
        Task<bool> UpdateAsync(Guid id, DoctorDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
