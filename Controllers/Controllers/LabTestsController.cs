using Medixa_AI.Domain.Entities;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LabTestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LabTestsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/LabTests
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tests = await _context.LabTests
                .Where(t => t.IsActive)
                .Select(t => new
                {
                    t.TestID,
                    t.TestName,
                    t.Description,
                    t.Category,
                    t.Price,
                    t.SampleType,
                    t.Unit,
                    t.IsActive,
                    t.CreatedAt
                })
                .ToListAsync();

            return Ok(tests);
        }

        // GET: api/LabTests/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var test = await _context.LabTests
                .Include(t => t.NormalRanges)
                .Include(t => t.Prerequisites)
                .Include(t => t.CheckupPolicies)
                .Include(t => t.MedicalRules)
                .FirstOrDefaultAsync(t => t.TestID == id);

            if (test == null)
                return NotFound(new { message = $"Lab test with ID {id} not found." });

            return Ok(test);
        }

        // GET: api/LabTests/by-category/{category}
        [HttpGet("by-category/{category}")]
        public async Task<IActionResult> GetByCategory(string category)
        {
            var tests = await _context.LabTests
                .Where(t => t.Category == category && t.IsActive)
                .ToListAsync();

            return Ok(tests);
        }

        // POST: api/LabTests
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LabTest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            model.TestID = Guid.NewGuid();
            model.CreatedAt = DateTime.UtcNow;

            _context.LabTests.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.TestID }, model);
        }

        // PUT: api/LabTests/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] LabTest model)
        {
            var existing = await _context.LabTests.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Lab test with ID {id} not found." });

            existing.TestName = model.TestName;
            existing.Description = model.Description;
            existing.Category = model.Category;
            existing.Price = model.Price;
            existing.SampleType = model.SampleType;
            existing.Unit = model.Unit;
            existing.IsActive = model.IsActive;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/LabTests/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _context.LabTests.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Lab test with ID {id} not found." });

            existing.IsActive = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
