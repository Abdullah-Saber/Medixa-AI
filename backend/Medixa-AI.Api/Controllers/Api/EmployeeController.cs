using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly ILogger<EmployeeController> _logger;

        public EmployeeController(IEmployeeService employeeService, ILogger<EmployeeController> _logger)
        {
            this._employeeService = employeeService;
            this._logger = _logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAll()
        {
            var employees = await _employeeService.GetAllAsync();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDto>> GetById(Guid id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee == null)
                return NotFound();
            return Ok(employee);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetActive()
        {
            var employees = await _employeeService.GetActiveEmployeesAsync();
            return Ok(employees);
        }

        [HttpGet("role/{role}")]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetByRole(EmployeeRole role)
        {
            var employees = await _employeeService.GetByRoleAsync(role);
            return Ok(employees);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeeDto>> Create(EmployeeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest("FullName is required.");

            var requesterRole = GetRequesterRole();
            if (requesterRole == null)
                return Unauthorized("Invalid or missing role claim.");

            var created = await _employeeService.CreateAsync(dto, requesterRole.Value);
            if (created == null)
                return Unauthorized("Only Admin can create staff.");

            return CreatedAtAction(nameof(GetById), new { id = created.EmployeeID }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, EmployeeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest("FullName is required.");

            var requesterRole = GetRequesterRole();
            if (requesterRole == null)
                return Unauthorized("Invalid or missing role claim.");

            var result = await _employeeService.UpdateAsync(id, dto, requesterRole.Value);
            if (!result)
                return Unauthorized("Only Admin can update staff.");

            return NoContent();
        }

        [HttpPut("{id}/deactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Deactivate(Guid id)
        {
            var requesterRole = GetRequesterRole();
            if (requesterRole == null)
                return Unauthorized("Invalid or missing role claim.");

            var result = await _employeeService.DeactivateAsync(id, requesterRole.Value);
            if (!result)
                return Unauthorized("Only Admin can deactivate staff.");

            return NoContent();
        }

        [HttpPut("{id}/activate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Activate(Guid id)
        {
            var requesterRole = GetRequesterRole();
            if (requesterRole == null)
                return Unauthorized("Invalid or missing role claim.");

            var result = await _employeeService.ActivateAsync(id, requesterRole.Value);
            if (!result)
                return Unauthorized("Only Admin can activate staff.");

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _employeeService.DeleteAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }

        private EmployeeRole? GetRequesterRole()
        {
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(roleClaim))
            {
                _logger.LogWarning("Access warning: Missing role claim.");
                return null;
            }
            if (!Enum.TryParse<EmployeeRole>(roleClaim, out var role))
            {
                _logger.LogWarning("Access warning: Invalid role claim '{RoleClaim}'.", roleClaim);
                return null;
            }
            return role;
        }
    }
}
