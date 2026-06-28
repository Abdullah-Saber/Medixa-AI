using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IRepository<TestOrder> _repository;
        private readonly IRepository<OrderDetail> _orderDetailRepository;

        public OrderService(IRepository<TestOrder> repository, IRepository<OrderDetail> orderDetailRepository)
        {
            _repository = repository;
            _orderDetailRepository = orderDetailRepository;
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
            var patientOrders = orders.Where(o => o.PatientID == patientId).ToList();
            if (!patientOrders.Any())
                return Enumerable.Empty<OrderDto>();

            var details = await _orderDetailRepository.GetAllAsync();
            var detailsGrouped = details.GroupBy(d => d.OrderID).ToDictionary(g => g.Key, g => g.ToList());

            var orderDtos = new List<OrderDto>();
            foreach (var order in patientOrders)
            {
                var dto = MapToDto(order);
                if (detailsGrouped.TryGetValue(order.OrderID, out var orderDetails))
                {
                    dto.OrderDetails = orderDetails;
                }
                else
                {
                    dto.OrderDetails = new List<OrderDetail>();
                }
                orderDtos.Add(dto);
            }
            return orderDtos;
        }

        public async Task<IEnumerable<OrderDto>> GetByTechnicianAsync(Guid technicianId)
        {
            var orders = await _repository.GetAllAsync();
            var techOrders = orders.Where(o => o.CreatedByEmployeeID == technicianId).ToList();
            if (!techOrders.Any())
                return Enumerable.Empty<OrderDto>();

            var details = await _orderDetailRepository.GetAllAsync();
            var detailsGrouped = details.GroupBy(d => d.OrderID).ToDictionary(g => g.Key, g => g.ToList());

            var orderDtos = new List<OrderDto>();
            foreach (var order in techOrders)
            {
                var dto = MapToDto(order);
                if (detailsGrouped.TryGetValue(order.OrderID, out var orderDetails))
                {
                    dto.OrderDetails = orderDetails;
                }
                else
                {
                    dto.OrderDetails = new List<OrderDetail>();
                }
                orderDtos.Add(dto);
            }
            return orderDtos;
        }

        public async Task<IEnumerable<OrderDto>> GetByDoctorAsync(Guid doctorId)
        {
            var orders = await _repository.GetAllAsync();
            var doctorOrders = orders.Where(o => o.DoctorID == doctorId).ToList();
            if (!doctorOrders.Any())
                return Enumerable.Empty<OrderDto>();

            var details = await _orderDetailRepository.GetAllAsync();
            var detailsGrouped = details.GroupBy(d => d.OrderID).ToDictionary(g => g.Key, g => g.ToList());

            var orderDtos = new List<OrderDto>();
            foreach (var order in doctorOrders)
            {
                var dto = MapToDto(order);
                if (detailsGrouped.TryGetValue(order.OrderID, out var orderDetails))
                {
                    dto.OrderDetails = orderDetails;
                }
                else
                {
                    dto.OrderDetails = new List<OrderDetail>();
                }
                orderDtos.Add(dto);
            }
            return orderDtos;
        }

        public async Task<IEnumerable<OrderDto>> GetAllWithDetailsAsync()
        {
            var orders = await _repository.GetAllAsync();
            var details = await _orderDetailRepository.GetAllAsync();
            var detailsGrouped = details.GroupBy(d => d.OrderID).ToDictionary(g => g.Key, g => g.ToList());

            var orderDtos = new List<OrderDto>();
            foreach (var order in orders)
            {
                var dto = MapToDto(order);
                if (detailsGrouped.TryGetValue(order.OrderID, out var orderDetails))
                {
                    dto.OrderDetails = orderDetails;
                }
                else
                {
                    dto.OrderDetails = new List<OrderDetail>();
                }
                orderDtos.Add(dto);
            }
            return orderDtos;
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
                CreatedAt = order.CreatedAt,
                OrderDetails = order.OrderDetails?.ToList()
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
                CreatedAt = dto.CreatedAt,
                OrderDetails = dto.OrderDetails != null ? new HashSet<OrderDetail>(dto.OrderDetails) : new HashSet<OrderDetail>()
            };
        }
    }
}
