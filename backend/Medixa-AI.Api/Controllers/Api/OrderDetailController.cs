using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderDetailController : ControllerBase
    {
        private readonly IOrderDetailService _orderDetailService;

        public OrderDetailController(IOrderDetailService orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetailDto>>> GetAll()
        {
            var orderDetails = await _orderDetailService.GetAllAsync();
            return Ok(orderDetails);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailDto>> GetById(Guid id)
        {
            var orderDetail = await _orderDetailService.GetByIdAsync(id);
            if (orderDetail == null)
                return NotFound();
            return Ok(orderDetail);
        }

        [HttpGet("order/{orderId}")]
        public async Task<ActionResult<IEnumerable<OrderDetailDto>>> GetByOrder(Guid orderId)
        {
            var orderDetails = await _orderDetailService.GetByOrderAsync(orderId);
            return Ok(orderDetails);
        }

        [HttpGet("test/{testId}")]
        public async Task<ActionResult<IEnumerable<OrderDetailDto>>> GetByTest(Guid testId)
        {
            var orderDetails = await _orderDetailService.GetByTestAsync(testId);
            return Ok(orderDetails);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<ActionResult<OrderDetailDto>> Create(OrderDetailDto dto)
        {
            if (dto.OrderID == Guid.Empty)
                return BadRequest("OrderID is required.");

            if (dto.TestID == Guid.Empty)
                return BadRequest("TestID is required.");

            if (dto.Price < 0)
                return BadRequest("Price must be non-negative.");

            var created = await _orderDetailService.CreateAsync(dto);
            if (created == null)
                return BadRequest("Failed to create order detail.");

            return CreatedAtAction(nameof(GetById), new { id = created.OrderDetailID }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> Update(Guid id, OrderDetailDto dto)
        {
            if (dto.OrderID == Guid.Empty)
                return BadRequest("OrderID is required.");

            if (dto.TestID == Guid.Empty)
                return BadRequest("TestID is required.");

            if (dto.Price < 0)
                return BadRequest("Price must be non-negative.");

            var result = await _orderDetailService.UpdateAsync(id, dto);
            if (!result)
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _orderDetailService.DeleteAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
    }
}
