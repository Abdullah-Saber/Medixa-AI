using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IRepository<Employee> _repository;

        public EmployeeService(IRepository<Employee> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
        {
            var employees = await _repository.GetAllAsync();
            return employees.Select(MapToDto);
        }

        public async Task<EmployeeDto?> GetByIdAsync(Guid id)
        {
            var employee = await _repository.GetByIdAsync(id);
            return employee == null ? null : MapToDto(employee);
        }

        public async Task<EmployeeDto?> CreateAsync(EmployeeDto dto, EmployeeRole requesterRole)
        {
            if (requesterRole != EmployeeRole.Admin)
                return null;

            var employee = MapToEntity(dto);
            await _repository.AddAsync(employee);
            await _repository.SaveChangesAsync();
            return MapToDto(employee);
        }

        public async Task<bool> UpdateAsync(Guid id, EmployeeDto dto, EmployeeRole requesterRole)
        {
            if (requesterRole != EmployeeRole.Admin)
                return false;

            var employee = await _repository.GetByIdAsync(id);
            if (employee == null)
                return false;

            employee.FullName = dto.FullName;
            employee.Role = dto.Role;
            employee.Phone = dto.Phone;
            employee.Email = dto.Email;
            employee.Salary = dto.Salary;
            employee.HireDate = dto.HireDate;
            employee.IsActive = dto.IsActive;

            _repository.Update(employee);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var employee = await _repository.GetByIdAsync(id);
            if (employee == null)
                return false;

            _repository.Delete(employee);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeactivateAsync(Guid id, EmployeeRole requesterRole)
        {
            if (requesterRole != EmployeeRole.Admin)
                return false;

            var employee = await _repository.GetByIdAsync(id);
            if (employee == null)
                return false;

            if (!employee.IsActive)
                return false;

            employee.IsActive = false;
            _repository.Update(employee);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ActivateAsync(Guid id, EmployeeRole requesterRole)
        {
            if (requesterRole != EmployeeRole.Admin)
                return false;

            var employee = await _repository.GetByIdAsync(id);
            if (employee == null)
                return false;

            if (employee.IsActive)
                return false;

            employee.IsActive = true;
            _repository.Update(employee);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<EmployeeDto>> GetActiveEmployeesAsync()
        {
            var employees = await _repository.GetAllAsync();
            return employees.Where(e => e.IsActive).Select(MapToDto);
        }

        public async Task<IEnumerable<EmployeeDto>> GetByRoleAsync(EmployeeRole role)
        {
            var employees = await _repository.GetAllAsync();
            return employees.Where(e => e.Role == role).Select(MapToDto);
        }

        private static EmployeeDto MapToDto(Employee employee)
        {
            return new EmployeeDto
            {
                EmployeeID = employee.EmployeeID,
                FullName = employee.FullName,
                Role = employee.Role,
                Phone = employee.Phone,
                Email = employee.Email,
                Salary = employee.Salary,
                HireDate = employee.HireDate,
                IsActive = employee.IsActive
            };
        }

        private static Employee MapToEntity(EmployeeDto dto)
        {
            return new Employee
            {
                EmployeeID = dto.EmployeeID,
                FullName = dto.FullName,
                Role = dto.Role,
                Phone = dto.Phone,
                Email = dto.Email,
                Salary = dto.Salary,
                HireDate = dto.HireDate,
                IsActive = dto.IsActive
            };
        }
    }
}
