using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
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
        public async Task<ActionResult<EmployeeDto>> Create(EmployeeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest("FullName is required.");

            if (!TryGetRequesterRole(out var requesterRole))
                return Unauthorized("Invalid or missing role header.");

            var created = await _employeeService.CreateAsync(dto, requesterRole);
            if (created == null)
                return Unauthorized("Only Admin can create staff.");

            return CreatedAtAction(nameof(GetById), new { id = created.EmployeeID }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, EmployeeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest("FullName is required.");

            if (!TryGetRequesterRole(out var requesterRole))
                return Unauthorized("Invalid or missing role header.");

            var result = await _employeeService.UpdateAsync(id, dto, requesterRole);
            if (!result)
                return Unauthorized("Only Admin can update staff.");

            return NoContent();
        }

        [HttpPut("{id}/deactivate")]
        public async Task<IActionResult> Deactivate(Guid id)
        {
            if (!TryGetRequesterRole(out var requesterRole))
                return Unauthorized("Invalid or missing role header.");

            var result = await _employeeService.DeactivateAsync(id, requesterRole);
            if (!result)
                return Unauthorized("Only Admin can deactivate staff.");

            return NoContent();
        }

        [HttpPut("{id}/activate")]
        public async Task<IActionResult> Activate(Guid id)
        {
            if (!TryGetRequesterRole(out var requesterRole))
                return Unauthorized("Invalid or missing role header.");

            var result = await _employeeService.ActivateAsync(id, requesterRole);
            if (!result)
                return Unauthorized("Only Admin can activate staff.");

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _employeeService.DeleteAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }

        private bool TryGetRequesterRole(out EmployeeRole role)
        {
            if (!Request.Headers.ContainsKey("role"))
            {
                role = default;
                return false;
            }

            return Enum.TryParse(Request.Headers["role"], true, out role);
        }
    }
}
