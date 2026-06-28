using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientAuthController : ControllerBase
    {
        private readonly IPatientAuthService _patientAuthService;
        private readonly IGoogleAuthService _googleAuthService;

        public PatientAuthController(IPatientAuthService patientAuthService, IGoogleAuthService googleAuthService)
        {
            _patientAuthService = patientAuthService;
            _googleAuthService = googleAuthService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Password is required.");

            var result = await _patientAuthService.LoginAsync(dto);
            if (result == null)
                return Unauthorized("Invalid email or password.");

            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(PatientRegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest("FullName is required.");

            if (string.IsNullOrWhiteSpace(dto.NationalID))
                return BadRequest("NationalID is required.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Password is required.");

            var result = await _patientAuthService.RegisterAsync(dto);
            if (result == null)
                return BadRequest("Email already exists.");

            return Ok(result);
        }

        [HttpPost("google")]
        public async Task<ActionResult<AuthResponseDto>> GoogleLogin(GoogleAuthRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.IdToken))
                return BadRequest("IdToken is required.");

            var result = await _googleAuthService.AuthenticatePatientAsync(dto);
            if (result == null)
                return Unauthorized("Invalid Google token.");

            return Ok(result);
        }
    }
}
