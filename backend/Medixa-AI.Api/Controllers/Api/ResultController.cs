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
    public class ResultController : ControllerBase
    {
        private readonly IResultService _resultService;
        private readonly ILogger<ResultController> _logger;

        public ResultController(IResultService resultService, ILogger<ResultController> _logger)
        {
            this._resultService = resultService;
            this._logger = _logger;
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
        [Authorize(Roles = "Technician")]
        public async Task<ActionResult<ResultDto>> Create(ResultDto dto)
        {
            if (dto.OrderDetailID == Guid.Empty)
                return BadRequest("OrderDetailID is required.");

            if (dto.TechnicianID == Guid.Empty)
                return BadRequest("TechnicianID is required.");

            var requesterRole = GetRequesterRole();
            if (requesterRole == null)
                return Unauthorized("Invalid or missing role claim.");

            var created = await _resultService.CreateAsync(dto, requesterRole.Value);
            if (created == null)
                return Unauthorized("Only Technician can create results.");

            return CreatedAtAction(nameof(GetById), new { id = created.ResultID }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Technician")]
        public async Task<IActionResult> Update(Guid id, ResultDto dto)
        {
            if (dto.OrderDetailID == Guid.Empty)
                return BadRequest("OrderDetailID is required.");

            if (dto.TechnicianID == Guid.Empty)
                return BadRequest("TechnicianID is required.");

            var requesterRole = GetRequesterRole();
            if (requesterRole == null)
                return Unauthorized("Invalid or missing role claim.");

            var result = await _resultService.UpdateAsync(id, dto, requesterRole.Value);
            if (!result)
                return Unauthorized("Only Technician can update results.");

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Technician")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _resultService.DeleteAsync(id);
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
