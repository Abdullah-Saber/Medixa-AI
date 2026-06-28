using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAll()
        {
            var patients = await _patientService.GetAllAsync();
            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetById(Guid id)
        {
            var patient = await _patientService.GetByIdAsync(id);
            if (patient == null)
                return NotFound();
            return Ok(patient);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<ActionResult<PatientDto>> Create(PatientDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest("FullName is required.");

            if (string.IsNullOrWhiteSpace(dto.NationalID))
                return BadRequest("NationalID is required.");

            var created = await _patientService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.PatientID }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> Update(Guid id, PatientDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest("FullName is required.");

            if (string.IsNullOrWhiteSpace(dto.NationalID))
                return BadRequest("NationalID is required.");

            var result = await _patientService.UpdateAsync(id, dto);
            if (!result)
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _patientService.DeleteAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
    }
}
