using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IRepository<Appointment> _repository;

        public AppointmentService(IRepository<Appointment> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAsync()
        {
            var appointments = await _repository.GetAllAsync();
            return appointments.Select(MapToDto);
        }

        public async Task<AppointmentDto?> GetByIdAsync(Guid id)
        {
            var appointment = await _repository.GetByIdAsync(id);
            return appointment == null ? null : MapToDto(appointment);
        }

        public async Task<AppointmentDto> CreateAsync(AppointmentDto dto)
        {
            var appointment = MapToEntity(dto);
            await _repository.AddAsync(appointment);
            await _repository.SaveChangesAsync();
            return MapToDto(appointment);
        }

        public async Task<bool> UpdateAsync(Guid id, AppointmentDto dto)
        {
            var appointment = await _repository.GetByIdAsync(id);
            if (appointment == null)
                return false;

            appointment.AppointmentDate = dto.AppointmentDate;
            appointment.Purpose = dto.Purpose;
            appointment.Status = dto.Status;
            appointment.ReminderSent = dto.ReminderSent;

            _repository.Update(appointment);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelAsync(Guid id)
        {
            var appointment = await _repository.GetByIdAsync(id);
            if (appointment == null)
                return false;

            appointment.Status = AppointmentStatus.Cancelled;
            _repository.Update(appointment);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CompleteAsync(Guid id)
        {
            var appointment = await _repository.GetByIdAsync(id);
            if (appointment == null)
                return false;

            appointment.Status = AppointmentStatus.Completed;
            _repository.Update(appointment);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<AppointmentDto>> GetByPatientAsync(Guid patientId)
        {
            var appointments = await _repository.GetAllAsync();
            return appointments.Where(a => a.PatientID == patientId).Select(MapToDto);
        }

        public async Task<IEnumerable<AppointmentDto>> GetByDoctorAsync(Guid doctorId)
        {
            var appointments = await _repository.GetAllAsync();
            return appointments.Where(a => a.PatientID == doctorId).Select(MapToDto);
        }

        private static AppointmentDto MapToDto(Appointment appointment)
        {
            return new AppointmentDto
            {
                AppointmentID = appointment.AppointmentID,
                PatientID = appointment.PatientID,
                AppointmentDate = appointment.AppointmentDate,
                Purpose = appointment.Purpose,
                Status = appointment.Status,
                ReminderSent = appointment.ReminderSent,
                CreatedAt = appointment.CreatedAt
            };
        }

        private static Appointment MapToEntity(AppointmentDto dto)
        {
            return new Appointment
            {
                AppointmentID = dto.AppointmentID == Guid.Empty ? Guid.NewGuid() : dto.AppointmentID,
                PatientID = dto.PatientID,
                AppointmentDate = dto.AppointmentDate,
                Purpose = dto.Purpose,
                Status = dto.Status,
                ReminderSent = dto.ReminderSent,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}