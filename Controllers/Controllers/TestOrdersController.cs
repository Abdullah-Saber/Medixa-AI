using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestOrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TestOrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TestOrders
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.TestOrders
                .Include(o => o.Patient)
                .Include(o => o.Doctor)
                .Include(o => o.CreatedByEmployee)
                .Include(o => o.OrderDetails)
                .Select(o => new
                {
                    o.OrderID,
                    PatientName = o.Patient.FullName,
                    DoctorName = o.Doctor != null ? o.Doctor.FullName : null,
                    CreatedBy = o.CreatedByEmployee.FullName,
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status,
                    o.Notes,
                    TestCount = o.OrderDetails.Count
                })
                .ToListAsync();

            return Ok(orders);
        }

        // GET: api/TestOrders/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _context.TestOrders
                .Include(o => o.Patient)
                .Include(o => o.Doctor)
                .Include(o => o.CreatedByEmployee)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Test)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Result)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.OrderID == id);

            if (order == null)
                return NotFound(new { message = $"Order with ID {id} not found." });

            return Ok(order);
        }

        // GET: api/TestOrders/patient/{patientId}
        [HttpGet("patient/{patientId:guid}")]
        public async Task<IActionResult> GetByPatient(Guid patientId)
        {
            var orders = await _context.TestOrders
                .Where(o => o.PatientID == patientId)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Test)
                .Include(o => o.Payment)
                .ToListAsync();

            return Ok(orders);
        }

        // POST: api/TestOrders
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TestOrder model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var patientExists = await _context.Patients.AnyAsync(p => p.PatientID == model.PatientID);
            if (!patientExists)
                return BadRequest(new { message = "Patient not found." });

            var employeeExists = await _context.Employees.AnyAsync(e => e.EmployeeID == model.CreatedByEmployeeID);
            if (!employeeExists)
                return BadRequest(new { message = "Employee not found." });

            model.OrderID = Guid.NewGuid();
            model.OrderDate = DateTime.UtcNow;
            model.CreatedAt = DateTime.UtcNow;
            model.Status = OrderStatus.Pending;

            // Calculate total amount from order details
            if (model.OrderDetails != null && model.OrderDetails.Any())
            {
                foreach (var detail in model.OrderDetails)
                {
                    detail.OrderDetailID = Guid.NewGuid();
                    detail.OrderID = model.OrderID;
                    detail.Status = TestStatus.Pending;
                }
                model.TotalAmount = model.OrderDetails.Sum(d => d.Price);
            }

            _context.TestOrders.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.OrderID }, model);
        }

        // PATCH: api/TestOrders/{id}/status
        [HttpPatch("{id:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] OrderStatus status)
        {
            var order = await _context.TestOrders.FindAsync(id);
            if (order == null)
                return NotFound(new { message = $"Order with ID {id} not found." });

            order.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order status updated.", order.Status });
        }

        // DELETE: api/TestOrders/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var order = await _context.TestOrders.FindAsync(id);
            if (order == null)
                return NotFound(new { message = $"Order with ID {id} not found." });

            order.Status = OrderStatus.Cancelled;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
