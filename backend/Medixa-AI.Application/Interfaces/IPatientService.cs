using Medixa_AI.Application.DTOs;

namespace Medixa_AI.Application.Interfaces
{
    public interface IPatientService
    {
        Task<IEnumerable<PatientDto>> GetAllAsync();
        Task<PatientDto?> GetByIdAsync(Guid id);
        Task<PatientDto> CreateAsync(PatientDto dto);
        Task<bool> UpdateAsync(Guid id, PatientDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
