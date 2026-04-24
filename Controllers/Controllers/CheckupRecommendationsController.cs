using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckupRecommendationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CheckupRecommendationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/CheckupRecommendations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var recommendations = await _context.CheckupRecommendations
                .Include(r => r.Patient)
                .Include(r => r.Test)
                .Select(r => new
                {
                    r.RecommendationID,
                    PatientName = r.Patient.FullName,
                    TestName = r.Test != null ? r.Test.TestName : null,
                    r.SuggestedDate,
                    r.Reason,
                    r.Status,
                    r.CreatedAt
                })
                .ToListAsync();

            return Ok(recommendations);
        }

        // GET: api/CheckupRecommendations/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var recommendation = await _context.CheckupRecommendations
                .Include(r => r.Patient)
                .Include(r => r.Test)
                .FirstOrDefaultAsync(r => r.RecommendationID == id);

            if (recommendation == null)
                return NotFound(new { message = $"Recommendation with ID {id} not found." });

            return Ok(recommendation);
        }

        // GET: api/CheckupRecommendations/patient/{patientId}
        [HttpGet("patient/{patientId:guid}")]
        public async Task<IActionResult> GetByPatient(Guid patientId)
        {
            var recommendations = await _context.CheckupRecommendations
                .Where(r => r.PatientID == patientId)
                .Include(r => r.Test)
                .OrderByDescending(r => r.SuggestedDate)
                .ToListAsync();

            return Ok(recommendations);
        }

        // POST: api/CheckupRecommendations
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CheckupRecommendation model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var patientExists = await _context.Patients.AnyAsync(p => p.PatientID == model.PatientID);
            if (!patientExists)
                return BadRequest(new { message = "Patient not found." });

            model.RecommendationID = Guid.NewGuid();
            model.CreatedAt = DateTime.UtcNow;
            model.Status = RecommendationStatus.Pending;

            _context.CheckupRecommendations.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.RecommendationID }, model);
        }

        // PATCH: api/CheckupRecommendations/{id}/status
        [HttpPatch("{id:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] RecommendationStatus status)
        {
            var recommendation = await _context.CheckupRecommendations.FindAsync(id);
            if (recommendation == null)
                return NotFound(new { message = $"Recommendation with ID {id} not found." });

            recommendation.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated.", recommendation.Status });
        }

        // DELETE: api/CheckupRecommendations/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var recommendation = await _context.CheckupRecommendations.FindAsync(id);
            if (recommendation == null)
                return NotFound(new { message = $"Recommendation with ID {id} not found." });

            _context.CheckupRecommendations.Remove(recommendation);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
