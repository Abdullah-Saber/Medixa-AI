using Medixa_AI.Domain.Entities;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medixa_AI.Controllers
{
    // ─────────────────────────────────────────
    // UploadedMedicalFiles
    // ─────────────────────────────────────────
    [ApiController]
    [Route("api/[controller]")]
    public class UploadedMedicalFilesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public UploadedMedicalFilesController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/UploadedMedicalFiles/patient/{patientId}
        [HttpGet("patient/{patientId:guid}")]
        public async Task<IActionResult> GetByPatient(Guid patientId)
        {
            var files = await _context.UploadedMedicalFiles
                .Where(f => f.PatientID == patientId)
                .Select(f => new
                {
                    f.FileID,
                    f.FileName,
                    f.FilePath,
                    f.Processed,
                    f.UploadedAt
                })
                .ToListAsync();

            return Ok(files);
        }

        // GET: api/UploadedMedicalFiles/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var file = await _context.UploadedMedicalFiles
                .Include(f => f.Patient)
                .FirstOrDefaultAsync(f => f.FileID == id);

            if (file == null)
                return NotFound(new { message = $"File with ID {id} not found." });

            return Ok(file);
        }

        // POST: api/UploadedMedicalFiles/upload/{patientId}
        [HttpPost("upload/{patientId:guid}")]
        public async Task<IActionResult> Upload(Guid patientId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided." });

            var patientExists = await _context.Patients.AnyAsync(p => p.PatientID == patientId);
            if (!patientExists)
                return BadRequest(new { message = "Patient not found." });

            // Save file to wwwroot/uploads
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", patientId.ToString());
            Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var record = new UploadedMedicalFile
            {
                FileID = Guid.NewGuid(),
                PatientID = patientId,
                FileName = file.FileName,
                FilePath = filePath,
                Processed = false,
                UploadedAt = DateTime.UtcNow
            };

            _context.UploadedMedicalFiles.Add(record);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = record.FileID }, record);
        }

        // PATCH: api/UploadedMedicalFiles/{id}/mark-processed
        [HttpPatch("{id:guid}/mark-processed")]
        public async Task<IActionResult> MarkProcessed(Guid id, [FromBody] string? extractedText)
        {
            var file = await _context.UploadedMedicalFiles.FindAsync(id);
            if (file == null)
                return NotFound(new { message = $"File with ID {id} not found." });

            file.Processed = true;
            file.ExtractedText = extractedText;
            await _context.SaveChangesAsync();

            return Ok(new { message = "File marked as processed." });
        }

        // DELETE: api/UploadedMedicalFiles/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var file = await _context.UploadedMedicalFiles.FindAsync(id);
            if (file == null)
                return NotFound(new { message = $"File with ID {id} not found." });

            _context.UploadedMedicalFiles.Remove(file);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    // ─────────────────────────────────────────
    // HealthMetricSnapshots
    // ─────────────────────────────────────────
    [ApiController]
    [Route("api/[controller]")]
    public class HealthMetricSnapshotsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HealthMetricSnapshotsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/HealthMetricSnapshots/patient/{patientId}
        [HttpGet("patient/{patientId:guid}")]
        public async Task<IActionResult> GetByPatient(Guid patientId)
        {
            var snapshots = await _context.HealthMetricSnapshots
                .Where(s => s.PatientID == patientId)
                .Include(s => s.Test)
                .Select(s => new
                {
                    s.SnapshotID,
                    TestName = s.Test.TestName,
                    s.LastValue,
                    s.TrendType,
                    s.CalculatedAt
                })
                .ToListAsync();

            return Ok(snapshots);
        }

        // GET: api/HealthMetricSnapshots/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var snapshot = await _context.HealthMetricSnapshots
                .Include(s => s.Patient)
                .Include(s => s.Test)
                .FirstOrDefaultAsync(s => s.SnapshotID == id);

            if (snapshot == null)
                return NotFound(new { message = $"Snapshot with ID {id} not found." });

            return Ok(snapshot);
        }

        // POST: api/HealthMetricSnapshots
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HealthMetricSnapshot model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var patientExists = await _context.Patients.AnyAsync(p => p.PatientID == model.PatientID);
            if (!patientExists)
                return BadRequest(new { message = "Patient not found." });

            var testExists = await _context.LabTests.AnyAsync(t => t.TestID == model.TestID);
            if (!testExists)
                return BadRequest(new { message = "Lab test not found." });

            // Upsert: update if exists, create if not
            var existing = await _context.HealthMetricSnapshots
                .FirstOrDefaultAsync(s => s.PatientID == model.PatientID && s.TestID == model.TestID);

            if (existing != null)
            {
                existing.LastValue = model.LastValue;
                existing.TrendType = model.TrendType;
                existing.CalculatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return Ok(existing);
            }

            model.SnapshotID = Guid.NewGuid();
            model.CalculatedAt = DateTime.UtcNow;

            _context.HealthMetricSnapshots.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.SnapshotID }, model);
        }
    }
}
