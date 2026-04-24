using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;

namespace Medixa_AI.Application.Services
{
    public class PatientService : IPatientService
    {
        private readonly IRepository<Patient> _repository;

        public PatientService(IRepository<Patient> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PatientDto>> GetAllAsync()
        {
            var patients = await _repository.GetAllAsync();
            return patients.Select(MapToDto);
        }

        public async Task<PatientDto?> GetByIdAsync(Guid id)
        {
            var patient = await _repository.GetByIdAsync(id);
            return patient == null ? null : MapToDto(patient);
        }

        public async Task<PatientDto> CreateAsync(PatientDto dto)
        {
            var patient = MapToEntity(dto);
            await _repository.AddAsync(patient);
            await _repository.SaveChangesAsync();
            return MapToDto(patient);
        }

        public async Task<bool> UpdateAsync(Guid id, PatientDto dto)
        {
            var patient = await _repository.GetByIdAsync(id);
            if (patient == null)
                return false;

            patient.FullName = dto.FullName;
            patient.NationalID = dto.NationalID;
            patient.Phone = dto.Phone;
            patient.Email = dto.Email;
            patient.Gender = dto.Gender;
            patient.DateOfBirth = dto.DateOfBirth;
            patient.Address = dto.Address;
            patient.BloodType = dto.BloodType;
            patient.IsActive = dto.IsActive;

            _repository.Update(patient);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var patient = await _repository.GetByIdAsync(id);
            if (patient == null)
                return false;

            _repository.Delete(patient);
            await _repository.SaveChangesAsync();
            return true;
        }

        private static PatientDto MapToDto(Patient patient)
        {
            return new PatientDto
            {
                PatientID = patient.PatientID,
                FullName = patient.FullName,
                NationalID = patient.NationalID,
                Phone = patient.Phone,
                Email = patient.Email,
                Gender = patient.Gender,
                DateOfBirth = patient.DateOfBirth,
                Address = patient.Address,
                BloodType = patient.BloodType,
                RegistrationDate = patient.RegistrationDate,
                IsActive = patient.IsActive
            };
        }

        private static Patient MapToEntity(PatientDto dto)
        {
            return new Patient
            {
                PatientID = dto.PatientID,
                FullName = dto.FullName,
                NationalID = dto.NationalID,
                Phone = dto.Phone,
                Email = dto.Email,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                Address = dto.Address,
                BloodType = dto.BloodType,
                RegistrationDate = dto.RegistrationDate,
                IsActive = dto.IsActive
            };
        }
    }
}
