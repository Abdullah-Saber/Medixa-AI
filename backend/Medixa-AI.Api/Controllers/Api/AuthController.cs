using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Password is required.");

            var result = await _authService.LoginAsync(dto);
            if (result == null)
                return Unauthorized("Invalid email or password.");

            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest("FullName is required.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Password is required.");

            var result = await _authService.RegisterAsync(dto);
            if (result == null)
                return BadRequest("Email already exists.");

            return Ok(result);
        }

        [HttpPost("forgot-password")]
        public ActionResult ForgotPassword(ForgotPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            return Ok(new { message = "If an account exists for this email, a password reset link has been sent." });
        }
    }
}
