using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;

namespace Medixa_AI.Application.Services
{
    public class OrderDetailService : IOrderDetailService
    {
        private readonly IRepository<OrderDetail> _repository;
        private readonly IRepository<LabTest> _labTestRepository;
        private readonly IRepository<TestOrder> _orderRepository;

        public OrderDetailService(
            IRepository<OrderDetail> repository,
            IRepository<LabTest> labTestRepository,
            IRepository<TestOrder> orderRepository)
        {
            _repository = repository;
            _labTestRepository = labTestRepository;
            _orderRepository = orderRepository;
        }

        public async Task<IEnumerable<OrderDetailDto>> GetAllAsync()
        {
            var orderDetails = await _repository.GetAllAsync();
            return orderDetails.Select(MapToDto);
        }

        public async Task<OrderDetailDto?> GetByIdAsync(Guid id)
        {
            var orderDetail = await _repository.GetByIdAsync(id);
            return orderDetail == null ? null : MapToDto(orderDetail);
        }

        public async Task<OrderDetailDto?> CreateAsync(OrderDetailDto dto)
        {
            var orderDetail = MapToEntity(dto);
            await _repository.AddAsync(orderDetail);
            await _repository.SaveChangesAsync();
            return MapToDto(orderDetail);
        }

        public async Task<bool> UpdateAsync(Guid id, OrderDetailDto dto)
        {
            var orderDetail = await _repository.GetByIdAsync(id);
            if (orderDetail == null)
                return false;

            orderDetail.OrderID = dto.OrderID;
            orderDetail.TestID = dto.TestID;
            orderDetail.Price = dto.Price;
            orderDetail.Status = dto.Status;
            orderDetail.IsAbnormal = dto.IsAbnormal;
            orderDetail.CompletedAt = dto.CompletedAt;

            _repository.Update(orderDetail);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var orderDetail = await _repository.GetByIdAsync(id);
            if (orderDetail == null)
                return false;

            _repository.Delete(orderDetail);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<OrderDetailDto>> GetByOrderAsync(Guid orderId)
        {
            var orderDetails = await _repository.GetAllAsync();
            return orderDetails.Where(od => od.OrderID == orderId).Select(MapToDto);
        }

        public async Task<IEnumerable<OrderDetailDto>> GetByTestAsync(Guid testId)
        {
            var orderDetails = await _repository.GetAllAsync();
            return orderDetails.Where(od => od.TestID == testId).Select(MapToDto);
        }

        public async Task<IEnumerable<LabTestStatDto>> GetCompletedTestStatsAsync()
        {
            var details = await _repository.GetAllAsync();
            var tests = await _labTestRepository.GetAllAsync();
            var orders = await _orderRepository.GetAllAsync();

            var completedDetails = details.Where(od => od.Status == TestStatus.Completed).ToList();
            if (!completedDetails.Any())
                return Enumerable.Empty<LabTestStatDto>();

            var completedStats = completedDetails
                .Join(tests, od => od.TestID, t => t.TestID, (od, t) => new { od, t })
                .Join(orders, combined => combined.od.OrderID, o => o.OrderID, (combined, o) => new { combined.od, combined.t, o })
                .GroupBy(x => x.t.TestName)
                .Select(g => new LabTestStatDto
                {
                    TestName = g.Key,
                    TotalPerformed = g.Count(),
                    AverageTurnaround = g.Any(x => x.od.CompletedAt.HasValue)
                        ? (int)g.Where(x => x.od.CompletedAt.HasValue)
                                .Average(x => (x.od.CompletedAt.Value - x.o.OrderDate).TotalHours)
                        : 0
                })
                .ToList();

            return completedStats;
        }

        private static OrderDetailDto MapToDto(OrderDetail orderDetail)
        {
            return new OrderDetailDto
            {
                OrderDetailID = orderDetail.OrderDetailID,
                OrderID = orderDetail.OrderID,
                TestID = orderDetail.TestID,
                Price = orderDetail.Price,
                Status = orderDetail.Status,
                IsAbnormal = orderDetail.IsAbnormal,
                CompletedAt = orderDetail.CompletedAt
            };
        }

        private static OrderDetail MapToEntity(OrderDetailDto dto)
        {
            return new OrderDetail
            {
                OrderDetailID = dto.OrderDetailID,
                OrderID = dto.OrderID,
                TestID = dto.TestID,
                Price = dto.Price,
                Status = dto.Status,
                IsAbnormal = dto.IsAbnormal,
                CompletedAt = dto.CompletedAt
            };
        }
    }
}
