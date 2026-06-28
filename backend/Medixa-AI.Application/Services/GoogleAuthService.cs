using Google.Apis.Auth;
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
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly IRepository<Patient> _patientRepository;
        private readonly IRepository<Doctor> _doctorRepository;
        private readonly IConfiguration _configuration;

        public GoogleAuthService(
            IRepository<Patient> patientRepository,
            IRepository<Doctor> doctorRepository,
            IConfiguration configuration)
        {
            _patientRepository = patientRepository;
            _doctorRepository = doctorRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> AuthenticatePatientAsync(GoogleAuthRequestDto dto)
        {
            var payload = await ValidateGoogleTokenAsync(dto.IdToken);
            if (payload == null)
                return null;

            if (string.IsNullOrEmpty(payload.Email))
                return null;

            var patients = await _patientRepository.GetAllAsync();
            var patient = patients.FirstOrDefault(p => p.Email == payload.Email);

            if (patient == null)
            {
                patient = new Patient
                {
                    PatientID = Guid.NewGuid(),
                    FullName = payload.Name ?? "Google User",
                    Email = payload.Email,
                    RegistrationDate = DateTime.UtcNow,
                    IsActive = true
                };

                await _patientRepository.AddAsync(patient);
                await _patientRepository.SaveChangesAsync();
            }

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

        public async Task<AuthResponseDto?> AuthenticateDoctorAsync(GoogleAuthRequestDto dto)
        {
            var payload = await ValidateGoogleTokenAsync(dto.IdToken);
            if (payload == null)
                return null;

            if (string.IsNullOrEmpty(payload.Email))
                return null;

            var doctors = await _doctorRepository.GetAllAsync();
            var doctor = doctors.FirstOrDefault(d => d.Email == payload.Email);

            if (doctor == null)
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

        private async Task<GoogleJsonWebSignature.Payload?> ValidateGoogleTokenAsync(string idToken)
        {
            try
            {
                var googleClientId = _configuration["Google:ClientId"];
                if (string.IsNullOrEmpty(googleClientId))
                    throw new InvalidOperationException("Google Client ID not configured.");

                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { googleClientId }
                };

                return await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            }
            catch
            {
                return null;
            }
        }

        private string GenerateJwtToken(Guid userId, string email, string role)
        {
            var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
            var issuer = _configuration["Jwt:Issuer"] ?? "MedixaAI";
            var audience = _configuration["Jwt:Audience"] ?? "MedixaAIUsers";

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim("UserType", role),
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
    }
}
