using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;

namespace Medixa_AI.Api.Controllers.Mvc
{
    public class DoctorDashboardController : Controller
    {
        private readonly IDoctorService _doctorService;
        private readonly IOrderService _orderService;
        private readonly IResultService _resultService;
        private readonly IPatientService _patientService;

        public DoctorDashboardController(
            IDoctorService doctorService,
            IOrderService orderService,
            IResultService resultService,
            IPatientService patientService)
        {
            _doctorService = doctorService;
            _orderService = orderService;
            _resultService = resultService;
            _patientService = patientService;
        }

        private Guid? GetDoctorId()
        {
            if (User.Identity == null || !User.Identity.IsAuthenticated)
                return null;

            var userTypeClaim = User.FindFirst("UserType")?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userTypeClaim != "Doctor" && roleClaim != "Doctor")
                return null;

            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(idClaim) || !Guid.TryParse(idClaim, out var doctorId))
                return null;

            return doctorId;
        }

        // GET: /DoctorDashboard
        public async Task<IActionResult> Index()
        {
            var doctorId = GetDoctorId();
            if (doctorId == null)
                return Unauthorized("Access Denied: Doctor role required.");

            var doctorOrders = await _orderService.GetByDoctorAsync(doctorId.Value);
            var orderDetailIds = doctorOrders
                .SelectMany(o => o.OrderDetails ?? new List<OrderDetail>())
                .Select(od => od.OrderDetailID)
                .ToHashSet();

            var allResults = await _resultService.GetAllAsync();
            var doctorResults = allResults.Where(r => orderDetailIds.Contains(r.OrderDetailID)).ToList();

            var patientIds = doctorOrders.Select(o => o.PatientID).Distinct().ToHashSet();
            var allPatients = await _patientService.GetAllAsync();
            var doctorPatients = allPatients.Where(p => patientIds.Contains(p.PatientID)).ToList();

            var viewModel = new DoctorDashboardViewModel
            {
                TotalPatients = doctorPatients.Count,
                PendingAppointments = doctorOrders.Count(o => o.Status == Domain.Enums.OrderStatus.Pending),
                TodayResults = doctorResults.Count(r => r.ResultDate.Date == DateTime.Today),
                ActiveOrders = doctorOrders.Count(o => o.Status == Domain.Enums.OrderStatus.Pending),
                RecentPatients = doctorPatients
                    .OrderByDescending(p => p.RegistrationDate)
                    .Take(5)
                    .Select(p => new RecentPatient
                    {
                        PatientID = p.PatientID,
                        FullName = p.FullName,
                        LastVisit = p.RegistrationDate
                    }).ToList(),
                UpcomingAppointments = new List<UpcomingAppointment>()
            };

            return View(viewModel);
        }

        // GET: /DoctorDashboard/Doctors
        public async Task<IActionResult> Doctors()
        {
            var doctorId = GetDoctorId();
            if (doctorId == null)
                return Unauthorized("Access Denied: Doctor role required.");

            var doctors = await _doctorService.GetAllAsync();
            return View(doctors);
        }

        // GET: /DoctorDashboard/Orders
        public async Task<IActionResult> Orders()
        {
            var doctorId = GetDoctorId();
            if (doctorId == null)
                return Unauthorized("Access Denied: Doctor role required.");

            var orders = await _orderService.GetByDoctorAsync(doctorId.Value);
            return View(orders);
        }

        // GET: /DoctorDashboard/Results
        public async Task<IActionResult> Results()
        {
            var doctorId = GetDoctorId();
            if (doctorId == null)
                return Unauthorized("Access Denied: Doctor role required.");

            var doctorOrders = await _orderService.GetByDoctorAsync(doctorId.Value);
            var orderDetailIds = doctorOrders
                .SelectMany(o => o.OrderDetails ?? new List<OrderDetail>())
                .Select(od => od.OrderDetailID)
                .ToHashSet();

            var allResults = await _resultService.GetAllAsync();
            var doctorResults = allResults.Where(r => orderDetailIds.Contains(r.OrderDetailID)).ToList();
            return View(doctorResults);
        }
    }
}
