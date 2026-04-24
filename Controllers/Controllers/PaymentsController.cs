using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var payments = await _context.Payments
                .Include(p => p.Order).ThenInclude(o => o.Patient)
                .Select(p => new
                {
                    p.PaymentID,
                    p.OrderID,
                    PatientName = p.Order.Patient.FullName,
                    p.PaymentDate,
                    p.AmountPaid,
                    p.PaymentMethod,
                    p.PaymentStatus,
                    p.TransactionReference
                })
                .ToListAsync();

            return Ok(payments);
        }

        // GET: api/Payments/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var payment = await _context.Payments
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.PaymentID == id);

            if (payment == null)
                return NotFound(new { message = $"Payment with ID {id} not found." });

            return Ok(payment);
        }

        // GET: api/Payments/order/{orderId}
        [HttpGet("order/{orderId:guid}")]
        public async Task<IActionResult> GetByOrder(Guid orderId)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderID == orderId);

            if (payment == null)
                return NotFound(new { message = "No payment found for this order." });

            return Ok(payment);
        }

        // POST: api/Payments
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Payment model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var order = await _context.TestOrders.FindAsync(model.OrderID);
            if (order == null)
                return BadRequest(new { message = "Order not found." });

            var duplicate = await _context.Payments.AnyAsync(p => p.OrderID == model.OrderID);
            if (duplicate)
                return Conflict(new { message = "A payment already exists for this order." });

            model.PaymentID = Guid.NewGuid();
            model.PaymentDate = DateTime.UtcNow;
            model.PaymentStatus = PaymentStatus.Paid;

            // Update order status
            order.Status = OrderStatus.Completed;

            _context.Payments.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.PaymentID }, model);
        }

        // PATCH: api/Payments/{id}/refund
        [HttpPatch("{id:guid}/refund")]
        public async Task<IActionResult> Refund(Guid id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
                return NotFound(new { message = $"Payment with ID {id} not found." });

            payment.PaymentStatus = PaymentStatus.Refunded;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment refunded successfully." });
        }
    }
}
