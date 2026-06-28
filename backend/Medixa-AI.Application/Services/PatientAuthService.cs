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
    public class PatientAuthService : IPatientAuthService
    {
        private readonly IRepository<Patient> _patientRepository;
        private readonly IConfiguration _configuration;

        public PatientAuthService(IRepository<Patient> patientRepository, IConfiguration configuration)
        {
            _patientRepository = patientRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var patients = await _patientRepository.GetAllAsync();
            var patient = patients.FirstOrDefault(p => p.Email == dto.Email);

            if (patient == null)
                return null;

            if (!VerifyPassword(dto.Password, patient.PasswordHash))
                return null;

            if (!patient.IsActive)
                return null;

            var token = GenerateJwtToken(patient.PatientID, patient.Email, "Patient");

            return new AuthResponseDto
            {
                Token = token,
                EmployeeId = patient.PatientID,
                FullName = patient.FullName,
                Email = patient.Email,
                Role = "Patient"
            };
        }

        public async Task<AuthResponseDto?> RegisterAsync(PatientRegisterDto dto)
        {
            var patients = await _patientRepository.GetAllAsync();

            if (patients.Any(p => p.Email == dto.Email))
                return null;

            var patient = new Patient
            {
                PatientID = Guid.NewGuid(),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                NationalID = dto.NationalID,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                Address = dto.Address,
                BloodType = dto.BloodType,
                PasswordHash = HashPassword(dto.Password),
                RegistrationDate = DateTime.UtcNow,
                IsActive = true
            };

            await _patientRepository.AddAsync(patient);
            await _patientRepository.SaveChangesAsync();

            var token = GenerateJwtToken(patient.PatientID, patient.Email, "Patient");

            return new AuthResponseDto
            {
                Token = token,
                EmployeeId = patient.PatientID,
                FullName = patient.FullName,
                Email = patient.Email,
                Role = "Patient"
            };
        }

        private string GenerateJwtToken(Guid patientId, string email, string role)
        {
            var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
            var issuer = _configuration["Jwt:Issuer"] ?? "MedixaAI";
            var audience = _configuration["Jwt:Audience"] ?? "MedixaAIUsers";

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, patientId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim("UserType", "Patient"),
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