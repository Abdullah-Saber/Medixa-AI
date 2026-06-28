using Medixa_AI.Application.DTOs;

namespace Medixa_AI.Application.Interfaces
{
    public interface IGoogleAuthService
    {
        Task<AuthResponseDto?> AuthenticatePatientAsync(GoogleAuthRequestDto dto);
        Task<AuthResponseDto?> AuthenticateDoctorAsync(GoogleAuthRequestDto dto);
    }
}
