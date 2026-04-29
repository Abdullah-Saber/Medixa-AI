using Microsoft.AspNetCore.Mvc;
using Medixa_AI.Application.DTOs;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        // TODO: Inject IAIService via constructor
        // private readonly IAIService _aiService;

        // POST: api/ai/interpret
        [HttpPost("interpret")]
        public async Task<ActionResult<AIInterpretationDto>> InterpretResults([FromBody] InterpretRequestDto dto)
        {
            // var interpretation = await _aiService.InterpretResultsAsync(dto);
            // return Ok(interpretation);
            return Ok(new AIInterpretationDto());
        }

        // GET: api/ai/trends/{patientId}
        [HttpGet("trends/{patientId}")]
        public async Task<ActionResult<IEnumerable<TrendDto>>> GetPatientTrends(Guid patientId)
        {
            // var trends = await _aiService.GetPatientTrendsAsync(patientId);
            // return Ok(trends);
            return Ok(new List<TrendDto>());
        }

        // GET: api/ai/recommendations/{patientId}
        [HttpGet("recommendations/{patientId}")]
        public async Task<ActionResult<IEnumerable<RecommendationDto>>> GetRecommendations(Guid patientId)
        {
            // var recommendations = await _aiService.GetRecommendationsAsync(patientId);
            // return Ok(recommendations);
            return Ok(new List<RecommendationDto>());
        }
    }
}
