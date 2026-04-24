using Medixa_AI.Domain.Entities;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    // ─────────────────────────────────────────
    // MembershipCategories
    // ─────────────────────────────────────────
    [ApiController]
    [Route("api/[controller]")]
    public class MembershipCategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MembershipCategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/MembershipCategories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.MembershipCategories
                .Select(c => new
                {
                    c.CategoryID,
                    c.CategoryName,
                    c.DiscountPercentage,
                    c.PointsMultiplier,
                    c.Description,
                    MembersCount = c.PatientMemberships.Count(m => m.IsActive)
                })
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/MembershipCategories/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var category = await _context.MembershipCategories
                .Include(c => c.PatientMemberships)
                .FirstOrDefaultAsync(c => c.CategoryID == id);

            if (category == null)
                return NotFound(new { message = $"Category with ID {id} not found." });

            return Ok(category);
        }

        // POST: api/MembershipCategories
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MembershipCategory model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            model.CategoryID = Guid.NewGuid();
            _context.MembershipCategories.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.CategoryID }, model);
        }

        // PUT: api/MembershipCategories/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] MembershipCategory model)
        {
            var existing = await _context.MembershipCategories.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Category with ID {id} not found." });

            existing.CategoryName = model.CategoryName;
            existing.DiscountPercentage = model.DiscountPercentage;
            existing.PointsMultiplier = model.PointsMultiplier;
            existing.Description = model.Description;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/MembershipCategories/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _context.MembershipCategories.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Category with ID {id} not found." });

            _context.MembershipCategories.Remove(existing);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    // ─────────────────────────────────────────
    // PatientMemberships
    // ─────────────────────────────────────────
    [ApiController]
    [Route("api/[controller]")]
    public class PatientMembershipsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PatientMembershipsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/PatientMemberships
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var memberships = await _context.PatientMemberships
                .Include(m => m.Patient)
                .Include(m => m.Category)
                .Select(m => new
                {
                    m.MembershipID,
                    PatientName = m.Patient.FullName,
                    CategoryName = m.Category.CategoryName,
                    m.PointsBalance,
                    m.StartDate,
                    m.ExpiryDate,
                    m.IsActive
                })
                .ToListAsync();

            return Ok(memberships);
        }

        // GET: api/PatientMemberships/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var membership = await _context.PatientMemberships
                .Include(m => m.Patient)
                .Include(m => m.Category)
                .FirstOrDefaultAsync(m => m.MembershipID == id);

            if (membership == null)
                return NotFound(new { message = $"Membership with ID {id} not found." });

            return Ok(membership);
        }

        // GET: api/PatientMemberships/patient/{patientId}
        [HttpGet("patient/{patientId:guid}")]
        public async Task<IActionResult> GetByPatient(Guid patientId)
        {
            var memberships = await _context.PatientMemberships
                .Where(m => m.PatientID == patientId)
                .Include(m => m.Category)
                .ToListAsync();

            return Ok(memberships);
        }

        // POST: api/PatientMemberships
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PatientMembership model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var patientExists = await _context.Patients.AnyAsync(p => p.PatientID == model.PatientID);
            if (!patientExists)
                return BadRequest(new { message = "Patient not found." });

            var categoryExists = await _context.MembershipCategories.AnyAsync(c => c.CategoryID == model.CategoryID);
            if (!categoryExists)
                return BadRequest(new { message = "Membership category not found." });

            model.MembershipID = Guid.NewGuid();
            model.IsActive = true;

            _context.PatientMemberships.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.MembershipID }, model);
        }

        // PATCH: api/PatientMemberships/{id}/points
        [HttpPatch("{id:guid}/points")]
        public async Task<IActionResult> AddPoints(Guid id, [FromBody] int points)
        {
            var membership = await _context.PatientMemberships.FindAsync(id);
            if (membership == null)
                return NotFound(new { message = $"Membership with ID {id} not found." });

            membership.PointsBalance += points;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Points updated.", membership.PointsBalance });
        }

        // DELETE: api/PatientMemberships/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Deactivate(Guid id)
        {
            var membership = await _context.PatientMemberships.FindAsync(id);
            if (membership == null)
                return NotFound(new { message = $"Membership with ID {id} not found." });

            membership.IsActive = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
