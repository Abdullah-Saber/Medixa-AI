using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestResultsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TestResultsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TestResults
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var results = await _context.TestResults
                .Include(r => r.OrderDetail).ThenInclude(od => od.Test)
                .Include(r => r.OrderDetail).ThenInclude(od => od.Order).ThenInclude(o => o.Patient)
                .Include(r => r.Technician)
                .Select(r => new
                {
                    r.ResultID,
                    r.OrderDetailID,
                    TestName = r.OrderDetail.Test.TestName,
                    PatientName = r.OrderDetail.Order.Patient.FullName,
                    TechnicianName = r.Technician.FullName,
                    r.ResultValue,
                    r.ResultText,
                    r.ResultDate,
                    r.Notes
                })
                .ToListAsync();

            return Ok(results);
        }

        // GET: api/TestResults/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _context.TestResults
                .Include(r => r.OrderDetail).ThenInclude(od => od.Test)
                .Include(r => r.Technician)
                .Include(r => r.AIInterpretation)
                .FirstOrDefaultAsync(r => r.ResultID == id);

            if (result == null)
                return NotFound(new { message = $"Test result with ID {id} not found." });

            return Ok(result);
        }

        // GET: api/TestResults/order-detail/{orderDetailId}
        [HttpGet("order-detail/{orderDetailId:guid}")]
        public async Task<IActionResult> GetByOrderDetail(Guid orderDetailId)
        {
            var result = await _context.TestResults
                .Include(r => r.AIInterpretation)
                .FirstOrDefaultAsync(r => r.OrderDetailID == orderDetailId);

            if (result == null)
                return NotFound(new { message = "No result found for this order detail." });

            return Ok(result);
        }

        // POST: api/TestResults
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TestResult model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var orderDetail = await _context.OrderDetails
                .Include(od => od.Test)
                .FirstOrDefaultAsync(od => od.OrderDetailID == model.OrderDetailID);

            if (orderDetail == null)
                return BadRequest(new { message = "Order detail not found." });

            var technicianExists = await _context.Employees.AnyAsync(e => e.EmployeeID == model.TechnicianID);
            if (!technicianExists)
                return BadRequest(new { message = "Technician not found." });

            // Check if result already exists
            var existingResult = await _context.TestResults.AnyAsync(r => r.OrderDetailID == model.OrderDetailID);
            if (existingResult)
                return Conflict(new { message = "A result already exists for this order detail." });

            model.ResultID = Guid.NewGuid();
            model.ResultDate = DateTime.UtcNow;
            model.CreatedAt = DateTime.UtcNow;

            // Check if result is abnormal using NormalRanges
            var normalRange = await _context.TestNormalRanges
                .FirstOrDefaultAsync(nr => nr.TestID == orderDetail.TestID);

            if (normalRange != null)
            {
                orderDetail.IsAbnormal = model.ResultValue < normalRange.MinValue || model.ResultValue > normalRange.MaxValue;
            }

            // Mark order detail as completed
            orderDetail.Status = TestStatus.Completed;
            orderDetail.CompletedAt = DateTime.UtcNow;

            _context.TestResults.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.ResultID }, model);
        }

        // PUT: api/TestResults/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] TestResult model)
        {
            var existing = await _context.TestResults.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Test result with ID {id} not found." });

            existing.ResultValue = model.ResultValue;
            existing.ResultText = model.ResultText;
            existing.Notes = model.Notes;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }
    }
}
