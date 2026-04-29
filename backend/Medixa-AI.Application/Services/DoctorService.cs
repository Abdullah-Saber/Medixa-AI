using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;

namespace Medixa_AI.Application.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly IRepository<Doctor> _repository;

        public DoctorService(IRepository<Doctor> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<DoctorDto>> GetAllAsync()
        {
            var doctors = await _repository.GetAllAsync();
            return doctors.Select(MapToDto);
        }

        public async Task<DoctorDto?> GetByIdAsync(Guid id)
        {
            var doctor = await _repository.GetByIdAsync(id);
            return doctor == null ? null : MapToDto(doctor);
        }

        public async Task<DoctorDto> CreateAsync(DoctorDto dto)
        {
            var doctor = MapToEntity(dto);
            await _repository.AddAsync(doctor);
            await _repository.SaveChangesAsync();
            return MapToDto(doctor);
        }

        public async Task<bool> UpdateAsync(Guid id, DoctorDto dto)
        {
            var doctor = await _repository.GetByIdAsync(id);
            if (doctor == null)
                return false;

            doctor.FullName = dto.FullName;
            doctor.Phone = dto.Phone;
            doctor.Email = dto.Email;
            doctor.SpecializationID = dto.SpecializationID;
            doctor.ClinicName = dto.ClinicName;
            doctor.IsActive = dto.IsActive;

            _repository.Update(doctor);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var doctor = await _repository.GetByIdAsync(id);
            if (doctor == null)
                return false;

            _repository.Delete(doctor);
            await _repository.SaveChangesAsync();
            return true;
        }

        private static DoctorDto MapToDto(Doctor doctor)
        {
            return new DoctorDto
            {
                DoctorID = doctor.DoctorID,
                FullName = doctor.FullName,
                Phone = doctor.Phone,
                Email = doctor.Email,
                SpecializationID = doctor.SpecializationID,
                ClinicName = doctor.ClinicName,
                IsActive = doctor.IsActive
            };
        }

        private static Doctor MapToEntity(DoctorDto dto)
        {
            return new Doctor
            {
                DoctorID = dto.DoctorID,
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                SpecializationID = dto.SpecializationID,
                ClinicName = dto.ClinicName,
                IsActive = dto.IsActive
            };
        }
    }
}
