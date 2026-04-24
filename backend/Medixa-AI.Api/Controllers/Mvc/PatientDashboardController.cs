using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Mvc
{
    public class PatientDashboardController : Controller
    {
        private readonly IPatientService _patientService;
        private readonly IOrderService _orderService;
        private readonly IResultService _resultService;

        public PatientDashboardController(
            IPatientService patientService,
            IOrderService orderService,
            IResultService resultService)
        {
            _patientService = patientService;
            _orderService = orderService;
            _resultService = resultService;
        }

        // GET: /PatientDashboard
        public async Task<IActionResult> Index()
        {
            var allPatients = await _patientService.GetAllAsync();
            var allOrders = await _orderService.GetAllAsync();
            var allResults = await _resultService.GetAllAsync();

            var viewModel = new PatientDashboardViewModel
            {
                AllPatients = allPatients,
                TotalOrders = allOrders.Count(),
                TotalResults = allResults.Count(),
                ActivePatients = allPatients.Count(p => p.IsActive)
            };

            return View(viewModel);
        }

        // GET: /PatientDashboard/Patients
        public async Task<IActionResult> Patients()
        {
            var patients = await _patientService.GetAllAsync();
            return View(patients);
        }

        // GET: /PatientDashboard/Orders
        public async Task<IActionResult> Orders()
        {
            var orders = await _orderService.GetAllAsync();
            return View(orders);
        }

        // GET: /PatientDashboard/Results
        public async Task<IActionResult> Results()
        {
            var results = await _resultService.GetAllAsync();
            return View(results);
        }

        // GET: /PatientDashboard/Orders/{patientId}
        public async Task<IActionResult> PatientOrders(Guid patientId)
        {
            var orders = await _orderService.GetByPatientAsync(patientId);
            return View(orders);
        }
    }

    public class PatientDashboardViewModel
    {
        public IEnumerable<PatientDto> AllPatients { get; set; } = new List<PatientDto>();
        public int TotalOrders { get; set; }
        public int TotalResults { get; set; }
        public int ActivePatients { get; set; }
    }
}
