using Medixa_AI.Domain.Entities;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DoctorsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Doctors
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var doctors = await _context.Doctors
                .Where(d => d.IsActive)
                .Include(d => d.Specialization)
                .Select(d => new
                {
                    d.DoctorID,
                    d.FullName,
                    d.Phone,
                    d.Email,
                    d.ClinicName,
                    d.IsActive,
                    Specialization = d.Specialization.Name
                })
                .ToListAsync();

            return Ok(doctors);
        }

        // GET: api/Doctors/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Specialization)
                .Include(d => d.Orders)
                .FirstOrDefaultAsync(d => d.DoctorID == id);

            if (doctor == null)
                return NotFound(new { message = $"Doctor with ID {id} not found." });

            return Ok(doctor);
        }

        // POST: api/Doctors
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Doctor model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var specExists = await _context.Specializations.AnyAsync(s => s.SpecializationID == model.SpecializationID);
            if (!specExists)
                return BadRequest(new { message = "Specialization not found." });

            model.DoctorID = Guid.NewGuid();
            _context.Doctors.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.DoctorID }, model);
        }

        // PUT: api/Doctors/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Doctor model)
        {
            var existing = await _context.Doctors.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Doctor with ID {id} not found." });

            existing.FullName = model.FullName;
            existing.Phone = model.Phone;
            existing.Email = model.Email;
            existing.SpecializationID = model.SpecializationID;
            existing.ClinicName = model.ClinicName;
            existing.IsActive = model.IsActive;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/Doctors/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _context.Doctors.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Doctor with ID {id} not found." });

            existing.IsActive = false; // Soft delete
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
