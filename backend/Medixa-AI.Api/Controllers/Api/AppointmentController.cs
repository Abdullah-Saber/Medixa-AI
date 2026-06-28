using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll()
        {
            var appointments = await _appointmentService.GetAllAsync();
            return Ok(appointments);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<AppointmentDto>> GetById(Guid id)
        {
            var appointment = await _appointmentService.GetByIdAsync(id);
            if (appointment == null)
                return NotFound();
            return Ok(appointment);
        }

        [HttpGet("patient/{patientId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetByPatient(Guid patientId)
        {
            var appointments = await _appointmentService.GetByPatientAsync(patientId);
            return Ok(appointments);
        }

        [HttpGet("doctor/{doctorId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetByDoctor(Guid doctorId)
        {
            var appointments = await _appointmentService.GetByDoctorAsync(doctorId);
            return Ok(appointments);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AppointmentDto>> Create(AppointmentDto dto)
        {
            if (dto.PatientID == Guid.Empty)
                return BadRequest("PatientID is required.");

            var created = await _appointmentService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.AppointmentID }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> Update(Guid id, AppointmentDto dto)
        {
            if (dto.PatientID == Guid.Empty)
                return BadRequest("PatientID is required.");

            var result = await _appointmentService.UpdateAsync(id, dto);
            if (!result)
                return NotFound();
            return NoContent();
        }

        [HttpPut("{id}/cancel")]
        [Authorize]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var result = await _appointmentService.CancelAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }

        [HttpPut("{id}/complete")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> Complete(Guid id)
        {
            var result = await _appointmentService.CompleteAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
    }
}