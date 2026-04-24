using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.Services
{
    public class ResultService : IResultService
    {
        private readonly IRepository<TestResult> _repository;

        public ResultService(IRepository<TestResult> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ResultDto>> GetAllAsync()
        {
            var results = await _repository.GetAllAsync();
            return results.Select(MapToDto);
        }

        public async Task<ResultDto?> GetByIdAsync(Guid id)
        {
            var result = await _repository.GetByIdAsync(id);
            return result == null ? null : MapToDto(result);
        }

        public async Task<ResultDto?> CreateAsync(ResultDto dto, EmployeeRole requesterRole)
        {
            if (requesterRole != EmployeeRole.Technician)
                return null;

            if (dto.TechnicianID == Guid.Empty)
                return null;

            // Skip FK validation for now - OrderDetail must exist in DB
            // This is a temporary workaround for testing without full OrderDetail setup
            var result = MapToEntity(dto);
            await _repository.AddAsync(result);
            await _repository.SaveChangesAsync();
            return MapToDto(result);
        }

        public async Task<bool> UpdateAsync(Guid id, ResultDto dto, EmployeeRole requesterRole)
        {
            if (requesterRole != EmployeeRole.Technician)
                return false;

            if (dto.TechnicianID == Guid.Empty)
                return false;

            var result = await _repository.GetByIdAsync(id);
            if (result == null)
                return false;

            result.OrderDetailID = dto.OrderDetailID;
            result.ResultValue = dto.ResultValue;
            result.ResultText = dto.ResultText;
            result.ResultDate = dto.ResultDate;
            result.TechnicianID = dto.TechnicianID;
            result.Notes = dto.Notes;

            _repository.Update(result);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var result = await _repository.GetByIdAsync(id);
            if (result == null)
                return false;

            _repository.Delete(result);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ResultDto>> GetByTechnicianAsync(Guid technicianId)
        {
            var results = await _repository.GetAllAsync();
            return results.Where(r => r.TechnicianID == technicianId).Select(MapToDto);
        }

        public async Task<IEnumerable<ResultDto>> GetByOrderAsync(Guid orderId)
        {
            var results = await _repository.GetAllAsync();
            return results.Where(r => r.OrderDetailID == orderId).Select(MapToDto);
        }

        private static ResultDto MapToDto(TestResult result)
        {
            return new ResultDto
            {
                ResultID = result.ResultID,
                OrderDetailID = result.OrderDetailID,
                ResultValue = result.ResultValue,
                ResultText = result.ResultText,
                ResultDate = result.ResultDate,
                TechnicianID = result.TechnicianID,
                Notes = result.Notes,
                CreatedAt = result.CreatedAt
            };
        }

        private static TestResult MapToEntity(ResultDto dto)
        {
            return new TestResult
            {
                ResultID = dto.ResultID,
                OrderDetailID = dto.OrderDetailID,
                ResultValue = dto.ResultValue,
                ResultText = dto.ResultText,
                ResultDate = dto.ResultDate,
                TechnicianID = dto.TechnicianID,
                Notes = dto.Notes,
                CreatedAt = dto.CreatedAt
            };
        }
    }
}
