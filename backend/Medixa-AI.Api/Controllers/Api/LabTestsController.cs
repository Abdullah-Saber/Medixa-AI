using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class LabTestsController : ControllerBase
    {
        private readonly ILabTestService _labTestService;

        public LabTestsController(ILabTestService labTestService)
        {
            _labTestService = labTestService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LabTestDto>>> GetAll()
        {
            var labTests = await _labTestService.GetAllAsync();
            return Ok(labTests);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LabTestDto>> GetById(Guid id)
        {
            var labTest = await _labTestService.GetByIdAsync(id);
            if (labTest == null)
                return NotFound();
            return Ok(labTest);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<LabTestDto>> Create(LabTestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.TestName))
                return BadRequest("TestName is required.");

            var created = await _labTestService.CreateAsync(dto);
            if (created == null)
                return BadRequest("Failed to create lab test.");

            return CreatedAtAction(nameof(GetById), new { id = created.TestID }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, LabTestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.TestName))
                return BadRequest("TestName is required.");

            var result = await _labTestService.UpdateAsync(id, dto);
            if (!result)
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _labTestService.DeleteAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
    }
}