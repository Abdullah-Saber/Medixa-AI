using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Select(a => new
                {
                    a.AppointmentID,
                    PatientName = a.Patient.FullName,
                    a.AppointmentDate,
                    a.Purpose,
                    a.Status,
                    a.ReminderSent,
                    a.CreatedAt
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // GET: api/Appointments/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.AppointmentID == id);

            if (appointment == null)
                return NotFound(new { message = $"Appointment with ID {id} not found." });

            return Ok(appointment);
        }

        // GET: api/Appointments/patient/{patientId}
        [HttpGet("patient/{patientId:guid}")]
        public async Task<IActionResult> GetByPatient(Guid patientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientID == patientId)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();

            return Ok(appointments);
        }

        // GET: api/Appointments/today
        [HttpGet("today")]
        public async Task<IActionResult> GetToday()
        {
            var today = DateTime.UtcNow.Date;
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Where(a => a.AppointmentDate.Date == today && a.Status == AppointmentStatus.Scheduled)
                .ToListAsync();

            return Ok(appointments);
        }

        // POST: api/Appointments
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Appointment model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var patientExists = await _context.Patients.AnyAsync(p => p.PatientID == model.PatientID);
            if (!patientExists)
                return BadRequest(new { message = "Patient not found." });

            model.AppointmentID = Guid.NewGuid();
            model.CreatedAt = DateTime.UtcNow;
            model.Status = AppointmentStatus.Scheduled;

            _context.Appointments.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.AppointmentID }, model);
        }

        // PATCH: api/Appointments/{id}/status
        [HttpPatch("{id:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] AppointmentStatus status)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = $"Appointment with ID {id} not found." });

            appointment.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment status updated.", appointment.Status });
        }

        // PATCH: api/Appointments/{id}/reminder
        [HttpPatch("{id:guid}/reminder")]
        public async Task<IActionResult> MarkReminderSent(Guid id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = $"Appointment with ID {id} not found." });

            appointment.ReminderSent = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reminder marked as sent." });
        }

        // DELETE: api/Appointments/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = $"Appointment with ID {id} not found." });

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
