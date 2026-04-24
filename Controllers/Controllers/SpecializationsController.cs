using Medixa_AI.Domain.Entities;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecializationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SpecializationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Specializations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var specializations = await _context.Specializations
                .Where(s => s.IsActive)
                .Select(s => new
                {
                    s.SpecializationID,
                    s.Name,
                    s.Description,
                    s.IsActive,
                    DoctorCount = s.Doctors.Count
                })
                .ToListAsync();

            return Ok(specializations);
        }

        // GET: api/Specializations/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var spec = await _context.Specializations
                .Include(s => s.Doctors)
                .FirstOrDefaultAsync(s => s.SpecializationID == id);

            if (spec == null)
                return NotFound(new { message = $"Specialization with ID {id} not found." });

            return Ok(spec);
        }

        // POST: api/Specializations
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Specialization model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Specializations.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.SpecializationID }, model);
        }

        // PUT: api/Specializations/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Specialization model)
        {
            var existing = await _context.Specializations.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Specialization with ID {id} not found." });

            existing.Name = model.Name;
            existing.Description = model.Description;
            existing.IsActive = model.IsActive;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/Specializations/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.Specializations.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Specialization with ID {id} not found." });

            existing.IsActive = false; // Soft delete
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
