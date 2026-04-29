using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecializationController : ControllerBase
    {
        private readonly ISpecializationService _specializationService;

        public SpecializationController(ISpecializationService specializationService)
        {
            _specializationService = specializationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecializationDto>>> GetAll()
        {
            var specializations = await _specializationService.GetAllAsync();
            return Ok(specializations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SpecializationDto>> GetById(int id)
        {
            var specialization = await _specializationService.GetByIdAsync(id);
            if (specialization == null)
                return NotFound();
            return Ok(specialization);
        }

        [HttpPost]
        public async Task<ActionResult<SpecializationDto>> Create(SpecializationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var created = await _specializationService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.SpecializationID }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SpecializationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var result = await _specializationService.UpdateAsync(id, dto);
            if (!result)
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _specializationService.DeleteAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
    }
}
