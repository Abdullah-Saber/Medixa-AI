using Medixa_AI.Application.DTOs;

namespace Medixa_AI.Application.Interfaces
{
    public interface IDoctorAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        Task<AuthResponseDto?> RegisterAsync(DoctorRegisterDto dto);
    }
}
