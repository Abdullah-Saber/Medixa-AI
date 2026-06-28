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
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrderController> _logger;

        public OrderController(IOrderService orderService, ILogger<OrderController> _logger)
        {
            this._orderService = orderService;
            this._logger = _logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll()
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetById(Guid id)
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
                return NotFound();
            return Ok(order);
        }

        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetByPatient(Guid patientId)
        {
            var orders = await _orderService.GetByPatientAsync(patientId);
            return Ok(orders);
        }

        [HttpGet("technician/{technicianId}")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetByTechnician(Guid technicianId)
        {
            var orders = await _orderService.GetByTechnicianAsync(technicianId);
            return Ok(orders);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<ActionResult<OrderDto>> Create(OrderDto dto)
        {
            if (dto.PatientID == Guid.Empty)
                return BadRequest("PatientID is required.");

            if (dto.CreatedByEmployeeID == Guid.Empty)
                return BadRequest("CreatedByEmployeeID is required.");

            var requesterRole = GetRequesterRole();
            if (requesterRole == null)
                return Unauthorized("Invalid or missing role claim.");

            var created = await _orderService.CreateAsync(dto, requesterRole.Value);
            if (created == null)
                return Unauthorized("Only Admin and Receptionist can create orders.");

            return CreatedAtAction(nameof(GetById), new { id = created.OrderID }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> Update(Guid id, OrderDto dto)
        {
            if (dto.PatientID == Guid.Empty)
                return BadRequest("PatientID is required.");

            if (dto.CreatedByEmployeeID == Guid.Empty)
                return BadRequest("CreatedByEmployeeID is required.");

            var requesterRole = GetRequesterRole();
            if (requesterRole == null)
                return Unauthorized("Invalid or missing role claim.");

            var result = await _orderService.UpdateAsync(id, dto, requesterRole.Value);
            if (!result)
                return Unauthorized("Only Admin and Receptionist can update orders.");

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _orderService.DeleteAsync(id);
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
