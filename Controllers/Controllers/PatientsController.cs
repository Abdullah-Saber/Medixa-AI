using Medixa_AI.Domain.Entities;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PatientsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Patients
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var patients = await _context.Patients
                .Where(p => p.IsActive)
                .Select(p => new
                {
                    p.PatientID,
                    p.FullName,
                    p.NationalID,
                    p.Phone,
                    p.Email,
                    p.Gender,
                    p.DateOfBirth,
                    p.BloodType,
                    p.RegistrationDate,
                    p.IsActive
                })
                .ToListAsync();

            return Ok(patients);
        }

        // GET: api/Patients/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var patient = await _context.Patients
                .Include(p => p.Orders)
                .Include(p => p.Appointments)
                .Include(p => p.Memberships).ThenInclude(m => m.Category)
                .Include(p => p.UploadedFiles)
                .Include(p => p.HealthSnapshots)
                .FirstOrDefaultAsync(p => p.PatientID == id);

            if (patient == null)
                return NotFound(new { message = $"Patient with ID {id} not found." });

            return Ok(patient);
        }

        // GET: api/Patients/search?nationalId=xxx
        [HttpGet("search")]
        public async Task<IActionResult> SearchByNationalId([FromQuery] string nationalId)
        {
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.NationalID == nationalId && p.IsActive);

            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            return Ok(patient);
        }

        // POST: api/Patients
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Patient model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var duplicate = await _context.Patients.AnyAsync(p => p.NationalID == model.NationalID);
            if (duplicate)
                return Conflict(new { message = "A patient with this National ID already exists." });

            model.PatientID = Guid.NewGuid();
            model.RegistrationDate = DateTime.UtcNow;
            _context.Patients.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.PatientID }, model);
        }

        // PUT: api/Patients/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Patient model)
        {
            var existing = await _context.Patients.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Patient with ID {id} not found." });

            existing.FullName = model.FullName;
            existing.Phone = model.Phone;
            existing.Email = model.Email;
            existing.Gender = model.Gender;
            existing.DateOfBirth = model.DateOfBirth;
            existing.Address = model.Address;
            existing.BloodType = model.BloodType;
            existing.IsActive = model.IsActive;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/Patients/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _context.Patients.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Patient with ID {id} not found." });

            existing.IsActive = false; // Soft delete
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
