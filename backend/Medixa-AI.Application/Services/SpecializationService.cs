using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;

namespace Medixa_AI.Application.Services
{
    public class SpecializationService : ISpecializationService
    {
        private readonly IRepository<Specialization> _repository;

        public SpecializationService(IRepository<Specialization> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<SpecializationDto>> GetAllAsync()
        {
            var specializations = await _repository.GetAllAsync();
            return specializations.Select(MapToDto);
        }

        public async Task<SpecializationDto?> GetByIdAsync(int id)
        {
            var specialization = await _repository.GetByIdAsync(Guid.NewGuid());
            if (specialization == null)
            {
                var all = await _repository.GetAllAsync();
                specialization = all.FirstOrDefault(s => s.SpecializationID == id);
            }
            return specialization == null ? null : MapToDto(specialization);
        }

        public async Task<SpecializationDto> CreateAsync(SpecializationDto dto)
        {
            var specialization = MapToEntity(dto);
            await _repository.AddAsync(specialization);
            await _repository.SaveChangesAsync();
            return MapToDto(specialization);
        }

        public async Task<bool> UpdateAsync(int id, SpecializationDto dto)
        {
            var all = await _repository.GetAllAsync();
            var specialization = all.FirstOrDefault(s => s.SpecializationID == id);
            if (specialization == null)
                return false;

            specialization.Name = dto.Name;
            specialization.Description = dto.Description;
            specialization.IsActive = dto.IsActive;

            _repository.Update(specialization);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var all = await _repository.GetAllAsync();
            var specialization = all.FirstOrDefault(s => s.SpecializationID == id);
            if (specialization == null)
                return false;

            _repository.Delete(specialization);
            await _repository.SaveChangesAsync();
            return true;
        }

        private static SpecializationDto MapToDto(Specialization specialization)
        {
            return new SpecializationDto
            {
                SpecializationID = specialization.SpecializationID,
                Name = specialization.Name,
                Description = specialization.Description,
                IsActive = specialization.IsActive
            };
        }

        private static Specialization MapToEntity(SpecializationDto dto)
        {
            return new Specialization
            {
                SpecializationID = dto.SpecializationID,
                Name = dto.Name,
                Description = dto.Description,
                IsActive = dto.IsActive
            };
        }
    }
}
