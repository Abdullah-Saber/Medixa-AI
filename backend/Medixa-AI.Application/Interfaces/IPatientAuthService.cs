using Medixa_AI.Application.DTOs;

namespace Medixa_AI.Application.Interfaces
{
    public interface IPatientAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        Task<AuthResponseDto?> RegisterAsync(PatientRegisterDto dto);
    }
}
