using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;

namespace Medixa_AI.Application.Services
{
    public class LabTestService : ILabTestService
    {
        private readonly IRepository<LabTest> _repository;

        public LabTestService(IRepository<LabTest> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<LabTestDto>> GetAllAsync()
        {
            var labTests = await _repository.GetAllAsync();
            return labTests.Select(MapToDto);
        }

        public async Task<LabTestDto?> GetByIdAsync(Guid id)
        {
            var labTest = await _repository.GetByIdAsync(id);
            return labTest == null ? null : MapToDto(labTest);
        }

        public async Task<LabTestDto?> CreateAsync(LabTestDto dto)
        {
            var labTest = MapToEntity(dto);
            await _repository.AddAsync(labTest);
            await _repository.SaveChangesAsync();
            return MapToDto(labTest);
        }

        public async Task<bool> UpdateAsync(Guid id, LabTestDto dto)
        {
            var labTest = await _repository.GetByIdAsync(id);
            if (labTest == null)
                return false;

            labTest.TestName = dto.TestName;
            labTest.Description = dto.Description;
            labTest.Category = dto.Category;
            labTest.Price = dto.Price;
            labTest.SampleType = dto.SampleType;
            labTest.Unit = dto.Unit;
            labTest.IsActive = dto.IsActive;

            _repository.Update(labTest);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var labTest = await _repository.GetByIdAsync(id);
            if (labTest == null)
                return false;

            _repository.Delete(labTest);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<LabTestDto>> GetByCategoryAsync(string category)
        {
            var labTests = await _repository.GetAllAsync();
            return labTests.Where(lt => lt.Category == category).Select(MapToDto);
        }

        private static LabTestDto MapToDto(LabTest labTest)
        {
            return new LabTestDto
            {
                TestID = labTest.TestID,
                TestName = labTest.TestName,
                Description = labTest.Description,
                Category = labTest.Category,
                Price = labTest.Price,
                SampleType = labTest.SampleType,
                Unit = labTest.Unit,
                IsActive = labTest.IsActive
            };
        }

        private static LabTest MapToEntity(LabTestDto dto)
        {
            return new LabTest
            {
                TestID = dto.TestID,
                TestName = dto.TestName,
                Description = dto.Description,
                Category = dto.Category,
                Price = dto.Price,
                SampleType = dto.SampleType,
                Unit = dto.Unit,
                IsActive = dto.IsActive
            };
        }
    }
}
