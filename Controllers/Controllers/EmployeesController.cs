using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Employees
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _context.Employees
                .Where(e => e.IsActive)
                .Select(e => new
                {
                    e.EmployeeID,
                    e.FullName,
                    e.Role,
                    e.Phone,
                    e.Email,
                    e.Salary,
                    e.HireDate,
                    e.IsActive
                })
                .ToListAsync();

            return Ok(employees);
        }

        // GET: api/Employees/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var employee = await _context.Employees
                .Include(e => e.Results)
                .FirstOrDefaultAsync(e => e.EmployeeID == id);

            if (employee == null)
                return NotFound(new { message = $"Employee with ID {id} not found." });

            return Ok(employee);
        }

        // GET: api/Employees/by-role/{role}
        [HttpGet("by-role/{role}")]
        public async Task<IActionResult> GetByRole(EmployeeRole role)
        {
            var employees = await _context.Employees
                .Where(e => e.Role == role && e.IsActive)
                .ToListAsync();

            return Ok(employees);
        }

        // POST: api/Employees
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Employee model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            model.EmployeeID = Guid.NewGuid();
            model.HireDate = model.HireDate == default ? DateTime.UtcNow : model.HireDate;

            _context.Employees.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.EmployeeID }, model);
        }

        // PUT: api/Employees/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Employee model)
        {
            var existing = await _context.Employees.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Employee with ID {id} not found." });

            existing.FullName = model.FullName;
            existing.Role = model.Role;
            existing.Phone = model.Phone;
            existing.Email = model.Email;
            existing.Salary = model.Salary;
            existing.IsActive = model.IsActive;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/Employees/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _context.Employees.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Employee with ID {id} not found." });

            existing.IsActive = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
