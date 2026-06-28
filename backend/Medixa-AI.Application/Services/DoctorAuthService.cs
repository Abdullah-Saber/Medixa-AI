using BCrypt.Net;
using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Medixa_AI.Application.Services
{
    public class DoctorAuthService : IDoctorAuthService
    {
        private readonly IRepository<Doctor> _doctorRepository;
        private readonly IConfiguration _configuration;

        public DoctorAuthService(IRepository<Doctor> doctorRepository, IConfiguration configuration)
        {
            _doctorRepository = doctorRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var doctors = await _doctorRepository.GetAllAsync();
            var doctor = doctors.FirstOrDefault(d => d.Email == dto.Email);

            if (doctor == null)
                return null;

            if (!VerifyPassword(dto.Password, doctor.PasswordHash))
                return null;

            if (!doctor.IsActive)
                return null;

            var token = GenerateJwtToken(doctor.DoctorID, doctor.Email, "Doctor");

            return new AuthResponseDto
            {
                Token = token,
                EmployeeId = doctor.DoctorID,
                FullName = doctor.FullName,
                Email = doctor.Email,
                Role = "Doctor"
            };
        }

        public async Task<AuthResponseDto?> RegisterAsync(DoctorRegisterDto dto)
        {
            var doctors = await _doctorRepository.GetAllAsync();

            if (doctors.Any(d => d.Email == dto.Email))
                return null;

            var doctor = new Doctor
            {
                DoctorID = Guid.NewGuid(),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                SpecializationID = dto.SpecializationID,
                ClinicName = dto.ClinicName,
                PasswordHash = HashPassword(dto.Password),
                IsActive = true
            };

            await _doctorRepository.AddAsync(doctor);
            await _doctorRepository.SaveChangesAsync();

            var token = GenerateJwtToken(doctor.DoctorID, doctor.Email, "Doctor");

            return new AuthResponseDto
            {
                Token = token,
                EmployeeId = doctor.DoctorID,
                FullName = doctor.FullName,
                Email = doctor.Email,
                Role = "Doctor"
            };
        }

        private string GenerateJwtToken(Guid doctorId, string email, string role)
        {
            var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
            var issuer = _configuration["Jwt:Issuer"] ?? "MedixaAI";
            var audience = _configuration["Jwt:Audience"] ?? "MedixaAIUsers";

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, doctorId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim("UserType", "Doctor"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var keyBytes = Encoding.UTF8.GetBytes(key);
            var signingKey = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string? hash)
        {
            if (string.IsNullOrEmpty(hash))
                return false;

            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}