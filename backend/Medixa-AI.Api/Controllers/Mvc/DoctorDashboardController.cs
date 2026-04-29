using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Mvc
{
    public class DoctorDashboardController : Controller
    {
        private readonly IDoctorService _doctorService;
        private readonly IOrderService _orderService;
        private readonly IResultService _resultService;

        public DoctorDashboardController(
            IDoctorService doctorService,
            IOrderService orderService,
            IResultService resultService)
        {
            _doctorService = doctorService;
            _orderService = orderService;
            _resultService = resultService;
        }

        // GET: /DoctorDashboard
        public async Task<IActionResult> Index()
        {
            var allDoctors = await _doctorService.GetAllAsync();
            var allOrders = await _orderService.GetAllAsync();
            var allResults = await _resultService.GetAllAsync();

            var viewModel = new DoctorDashboardViewModel
            {
                AllDoctors = allDoctors,
                TotalOrders = allOrders.Count(),
                TotalResults = allResults.Count(),
                ActiveDoctors = allDoctors.Count(d => d.IsActive)
            };

            return View(viewModel);
        }

        // GET: /DoctorDashboard/Doctors
        public async Task<IActionResult> Doctors()
        {
            var doctors = await _doctorService.GetAllAsync();
            return View(doctors);
        }

        // GET: /DoctorDashboard/Orders
        public async Task<IActionResult> Orders()
        {
            var orders = await _orderService.GetAllAsync();
            return View(orders);
        }

        // GET: /DoctorDashboard/Results
        public async Task<IActionResult> Results()
        {
            var results = await _resultService.GetAllAsync();
            return View(results);
        }
    }

    public class DoctorDashboardViewModel
    {
        public IEnumerable<DoctorDto> AllDoctors { get; set; } = new List<DoctorDto>();
        public int TotalOrders { get; set; }
        public int TotalResults { get; set; }
        public int ActiveDoctors { get; set; }
    }
}
