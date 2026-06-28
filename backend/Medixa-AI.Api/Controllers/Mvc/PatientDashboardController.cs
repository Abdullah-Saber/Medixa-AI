using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;

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

        private Guid? GetPatientId()
        {
            if (User.Identity == null || !User.Identity.IsAuthenticated)
                return null;

            var userTypeClaim = User.FindFirst("UserType")?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userTypeClaim != "Patient" && roleClaim != "Patient")
                return null;

            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(idClaim) || !Guid.TryParse(idClaim, out var patientId))
                return null;

            return patientId;
        }

        // GET: /PatientDashboard
        public async Task<IActionResult> Index()
        {
            var patientId = GetPatientId();
            if (patientId == null)
                return Unauthorized("Access Denied: Patient role required.");

            var patient = await _patientService.GetByIdAsync(patientId.Value);
            var fullName = patient?.FullName ?? "Patient User";

            var allOrders = await _orderService.GetByPatientAsync(patientId.Value);
            var allResults = await _resultService.GetAllAsync();

            var patientOrderDetailIds = allOrders
                .SelectMany(o => o.OrderDetails ?? new List<OrderDetail>())
                .Select(od => od.OrderDetailID)
                .ToHashSet();

            var patientResults = allResults.Where(r => patientOrderDetailIds.Contains(r.OrderDetailID)).ToList();

            var viewModel = new PatientDashboardViewModel
            {
                PatientID = patientId.Value,
                FullName = fullName,
                TotalOrders = allOrders.Count(),
                PendingResults = patientResults.Count(r => r.ResultText == null || r.ResultText == ""),
                CompletedResults = patientResults.Count(r => r.ResultText != null && r.ResultText != ""),
                RecentOrders = allOrders
                    .Take(5)
                    .Select(o => new RecentOrder
                    {
                        OrderID = BitConverter.ToInt32(o.OrderID.ToByteArray(), 0) & 0x7FFFFFFF,
                        OrderDate = o.OrderDate,
                        Status = o.Status.ToString(),
                        TestCount = o.OrderDetails?.Count ?? 0
                    }).ToList(),
                HealthAlerts = new List<HealthAlert>() // Mock data removed
            };

            return View(viewModel);
        }

        // GET: /PatientDashboard/Patients
        public async Task<IActionResult> Patients()
        {
            var patientId = GetPatientId();
            if (patientId == null)
                return Unauthorized("Access Denied: Patient role required.");

            var patient = await _patientService.GetByIdAsync(patientId.Value);
            var patientsList = patient != null ? new List<PatientDto> { patient } : new List<PatientDto>();
            return View(patientsList);
        }

        // GET: /PatientDashboard/Orders
        public async Task<IActionResult> Orders()
        {
            var patientId = GetPatientId();
            if (patientId == null)
                return Unauthorized("Access Denied: Patient role required.");

            var orders = await _orderService.GetByPatientAsync(patientId.Value);
            return View(orders);
        }

        // GET: /PatientDashboard/Results
        public async Task<IActionResult> Results()
        {
            var patientId = GetPatientId();
            if (patientId == null)
                return Unauthorized("Access Denied: Patient role required.");

            var allOrders = await _orderService.GetByPatientAsync(patientId.Value);
            var patientOrderDetailIds = allOrders
                .SelectMany(o => o.OrderDetails ?? new List<OrderDetail>())
                .Select(od => od.OrderDetailID)
                .ToHashSet();

            var allResults = await _resultService.GetAllAsync();
            var patientResults = allResults.Where(r => patientOrderDetailIds.Contains(r.OrderDetailID)).ToList();
            return View(patientResults);
        }

        // GET: /PatientDashboard/Orders/{patientId}
        public async Task<IActionResult> PatientOrders(Guid patientId)
        {
            var loggedInPatientId = GetPatientId();
            if (loggedInPatientId == null || loggedInPatientId.Value != patientId)
                return Unauthorized("Access Denied: You can only view your own orders.");

            var orders = await _orderService.GetByPatientAsync(patientId);
            return View(orders);
        }
    }
}
