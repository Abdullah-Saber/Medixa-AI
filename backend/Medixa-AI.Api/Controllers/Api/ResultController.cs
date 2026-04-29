using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResultController : ControllerBase
    {
        private readonly IResultService _resultService;

        public ResultController(IResultService resultService)
        {
            _resultService = resultService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ResultDto>>> GetAll()
        {
            var results = await _resultService.GetAllAsync();
            return Ok(results);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResultDto>> GetById(Guid id)
        {
            var result = await _resultService.GetByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpGet("technician/{technicianId}")]
        public async Task<ActionResult<IEnumerable<ResultDto>>> GetByTechnician(Guid technicianId)
        {
            var results = await _resultService.GetByTechnicianAsync(technicianId);
            return Ok(results);
        }

        [HttpGet("order/{orderId}")]
        public async Task<ActionResult<IEnumerable<ResultDto>>> GetByOrder(Guid orderId)
        {
            var results = await _resultService.GetByOrderAsync(orderId);
            return Ok(results);
        }

        [HttpPost]
        public async Task<ActionResult<ResultDto>> Create(ResultDto dto)
        {
            // Temporarily allow empty OrderDetailID for testing without OrderDetail setup
            // if (dto.OrderDetailID == Guid.Empty)
            //     return BadRequest("OrderDetailID is required.");

            if (dto.TechnicianID == Guid.Empty)
                return BadRequest("TechnicianID is required.");

            if (!TryGetRequesterRole(out var requesterRole))
                return Unauthorized("Invalid or missing role header.");

            var created = await _resultService.CreateAsync(dto, requesterRole);
            if (created == null)
                return Unauthorized("Only Technician can create results.");

            return CreatedAtAction(nameof(GetById), new { id = created.ResultID }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, ResultDto dto)
        {
            if (dto.OrderDetailID == Guid.Empty)
                return BadRequest("OrderDetailID is required.");

            if (dto.TechnicianID == Guid.Empty)
                return BadRequest("TechnicianID is required.");

            if (!TryGetRequesterRole(out var requesterRole))
                return Unauthorized("Invalid or missing role header.");

            var result = await _resultService.UpdateAsync(id, dto, requesterRole);
            if (!result)
                return Unauthorized("Only Technician can update results.");

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _resultService.DeleteAsync(id);
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
