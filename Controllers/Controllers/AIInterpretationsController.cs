using Medixa_AI.Domain.Entities;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIInterpretationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AIInterpretationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/AIInterpretations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var interpretations = await _context.AIInterpretations
                .Include(i => i.Result).ThenInclude(r => r.OrderDetail).ThenInclude(od => od.Test)
                .Include(i => i.SuggestedSpecialization)
                .Select(i => new
                {
                    i.InterpretationID,
                    i.ResultID,
                    TestName = i.Result.OrderDetail.Test.TestName,
                    i.RiskLevel,
                    i.SummaryText,
                    SuggestedSpecialization = i.SuggestedSpecialization != null ? i.SuggestedSpecialization.Name : null,
                    i.GeneratedAt
                })
                .ToListAsync();

            return Ok(interpretations);
        }

        // GET: api/AIInterpretations/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var interpretation = await _context.AIInterpretations
                .Include(i => i.Result)
                .Include(i => i.SuggestedSpecialization)
                .FirstOrDefaultAsync(i => i.InterpretationID == id);

            if (interpretation == null)
                return NotFound(new { message = $"AI Interpretation with ID {id} not found." });

            return Ok(interpretation);
        }

        // GET: api/AIInterpretations/result/{resultId}
        [HttpGet("result/{resultId:guid}")]
        public async Task<IActionResult> GetByResult(Guid resultId)
        {
            var interpretation = await _context.AIInterpretations
                .Include(i => i.SuggestedSpecialization)
                .FirstOrDefaultAsync(i => i.ResultID == resultId);

            if (interpretation == null)
                return NotFound(new { message = "No AI interpretation found for this result." });

            return Ok(interpretation);
        }

        // POST: api/AIInterpretations
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AIInterpretation model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var resultExists = await _context.TestResults.AnyAsync(r => r.ResultID == model.ResultID);
            if (!resultExists)
                return BadRequest(new { message = "Test result not found." });

            var duplicate = await _context.AIInterpretations.AnyAsync(i => i.ResultID == model.ResultID);
            if (duplicate)
                return Conflict(new { message = "An AI interpretation already exists for this result." });

            model.InterpretationID = Guid.NewGuid();
            model.GeneratedAt = DateTime.UtcNow;

            _context.AIInterpretations.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.InterpretationID }, model);
        }

        // PUT: api/AIInterpretations/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] AIInterpretation model)
        {
            var existing = await _context.AIInterpretations.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"AI Interpretation with ID {id} not found." });

            existing.RiskLevel = model.RiskLevel;
            existing.SummaryText = model.SummaryText;
            existing.SuggestedSpecializationID = model.SuggestedSpecializationID;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }
    }
}
