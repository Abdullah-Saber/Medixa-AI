using BCrypt.Net;
using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Medixa_AI.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IRepository<Employee> _employeeRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IRepository<Employee> employeeRepository, IConfiguration configuration)
        {
            _employeeRepository = employeeRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var employees = await _employeeRepository.GetAllAsync();
            var employee = employees.FirstOrDefault(e => e.Email == dto.Email);

            if (employee == null)
                return null;

            // Verify password (in production, use BCrypt or similar)
            if (!VerifyPassword(dto.Password, employee.PasswordHash))
                return null;

            if (!employee.IsActive)
                return null;

            var token = GenerateJwtToken(employee.EmployeeID, employee.Email, employee.Role.ToString());

            return new AuthResponseDto
            {
                Token = token,
                EmployeeId = employee.EmployeeID,
                FullName = employee.FullName,
                Email = employee.Email,
                Role = employee.Role.ToString()
            };
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
        {
            var employees = await _employeeRepository.GetAllAsync();
            
            // Check if email already exists
            if (employees.Any(e => e.Email == dto.Email))
                return null;

            var employee = new Employee
            {
                EmployeeID = Guid.NewGuid(),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Role = dto.Role,
                PasswordHash = HashPassword(dto.Password),
                Salary = 0,
                HireDate = DateTime.Now,
                IsActive = true
            };

            await _employeeRepository.AddAsync(employee);
            await _employeeRepository.SaveChangesAsync();

            var token = GenerateJwtToken(employee.EmployeeID, employee.Email, employee.Role.ToString());

            return new AuthResponseDto
            {
                Token = token,
                EmployeeId = employee.EmployeeID,
                FullName = employee.FullName,
                Email = employee.Email,
                Role = employee.Role.ToString()
            };
        }

        public string GenerateJwtToken(Guid employeeId, string email, string role)
        {
            var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
            var issuer = _configuration["Jwt:Issuer"] ?? "MedixaAI";
            var audience = _configuration["Jwt:Audience"] ?? "MedixaAIUsers";

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, employeeId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role, role),
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
