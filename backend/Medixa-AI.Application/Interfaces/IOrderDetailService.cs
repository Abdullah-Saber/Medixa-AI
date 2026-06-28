using Medixa_AI.Application.DTOs;

namespace Medixa_AI.Application.Interfaces
{
    public interface IOrderDetailService
    {
        Task<IEnumerable<OrderDetailDto>> GetAllAsync();
        Task<OrderDetailDto?> GetByIdAsync(Guid id);
        Task<OrderDetailDto?> CreateAsync(OrderDetailDto dto);
        Task<bool> UpdateAsync(Guid id, OrderDetailDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<OrderDetailDto>> GetByOrderAsync(Guid orderId);
        Task<IEnumerable<OrderDetailDto>> GetByTestAsync(Guid testId);
        Task<IEnumerable<LabTestStatDto>> GetCompletedTestStatsAsync();
    }
}
