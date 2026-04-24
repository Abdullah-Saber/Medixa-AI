using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
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
        public async Task<ActionResult<OrderDto>> Create(OrderDto dto)
        {
            if (dto.PatientID == Guid.Empty)
                return BadRequest("PatientID is required.");

            if (dto.CreatedByEmployeeID == Guid.Empty)
                return BadRequest("CreatedByEmployeeID is required.");

            if (!TryGetRequesterRole(out var requesterRole))
                return Unauthorized("Invalid or missing role header.");

            var created = await _orderService.CreateAsync(dto, requesterRole);
            if (created == null)
                return Unauthorized("Only Admin and Receptionist can create orders.");

            return CreatedAtAction(nameof(GetById), new { id = created.OrderID }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, OrderDto dto)
        {
            if (dto.PatientID == Guid.Empty)
                return BadRequest("PatientID is required.");

            if (dto.CreatedByEmployeeID == Guid.Empty)
                return BadRequest("CreatedByEmployeeID is required.");

            if (!TryGetRequesterRole(out var requesterRole))
                return Unauthorized("Invalid or missing role header.");

            var result = await _orderService.UpdateAsync(id, dto, requesterRole);
            if (!result)
                return Unauthorized("Only Admin and Receptionist can update orders.");

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _orderService.DeleteAsync(id);
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
