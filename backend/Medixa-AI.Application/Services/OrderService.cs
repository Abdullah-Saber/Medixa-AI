using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IRepository<TestOrder> _repository;

        public OrderService(IRepository<TestOrder> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<OrderDto>> GetAllAsync()
        {
            var orders = await _repository.GetAllAsync();
            return orders.Select(MapToDto);
        }

        public async Task<OrderDto?> GetByIdAsync(Guid id)
        {
            var order = await _repository.GetByIdAsync(id);
            return order == null ? null : MapToDto(order);
        }

        public async Task<OrderDto?> CreateAsync(OrderDto dto, EmployeeRole requesterRole)
        {
            if (requesterRole != EmployeeRole.Admin && requesterRole != EmployeeRole.Receptionist)
                return null;

            var order = MapToEntity(dto);
            await _repository.AddAsync(order);
            await _repository.SaveChangesAsync();
            return MapToDto(order);
        }

        public async Task<bool> UpdateAsync(Guid id, OrderDto dto, EmployeeRole requesterRole)
        {
            if (requesterRole != EmployeeRole.Admin && requesterRole != EmployeeRole.Receptionist)
                return false;

            var order = await _repository.GetByIdAsync(id);
            if (order == null)
                return false;

            order.PatientID = dto.PatientID;
            order.DoctorID = dto.DoctorID;
            order.OrderDate = dto.OrderDate;
            order.TotalAmount = dto.TotalAmount;
            order.Status = dto.Status;
            order.Notes = dto.Notes;
            order.CreatedByEmployeeID = dto.CreatedByEmployeeID;

            _repository.Update(order);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null)
                return false;

            _repository.Delete(order);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<OrderDto>> GetByPatientAsync(Guid patientId)
        {
            var orders = await _repository.GetAllAsync();
            return orders.Where(o => o.PatientID == patientId).Select(MapToDto);
        }

        public async Task<IEnumerable<OrderDto>> GetByTechnicianAsync(Guid technicianId)
        {
            var orders = await _repository.GetAllAsync();
            return orders.Where(o => o.CreatedByEmployeeID == technicianId).Select(MapToDto);
        }

        private static OrderDto MapToDto(TestOrder order)
        {
            return new OrderDto
            {
                OrderID = order.OrderID,
                PatientID = order.PatientID,
                DoctorID = order.DoctorID,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                Notes = order.Notes,
                CreatedByEmployeeID = order.CreatedByEmployeeID,
                CreatedAt = order.CreatedAt
            };
        }

        private static TestOrder MapToEntity(OrderDto dto)
        {
            return new TestOrder
            {
                OrderID = dto.OrderID,
                PatientID = dto.PatientID,
                DoctorID = dto.DoctorID,
                OrderDate = dto.OrderDate,
                TotalAmount = dto.TotalAmount,
                Status = dto.Status,
                Notes = dto.Notes,
                CreatedByEmployeeID = dto.CreatedByEmployeeID,
                CreatedAt = dto.CreatedAt
            };
        }
    }
}
