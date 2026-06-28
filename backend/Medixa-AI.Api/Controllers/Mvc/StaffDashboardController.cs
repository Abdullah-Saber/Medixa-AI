using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;
using Medixa_AI.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;

namespace Medixa_AI.Api.Controllers.Mvc
{
    public class StaffDashboardController : Controller
    {
        private readonly IEmployeeService _employeeService;
        private readonly IOrderService _orderService;
        private readonly IOrderDetailService _orderDetailService;
        private readonly IPatientService _patientService;

        public StaffDashboardController(
            IEmployeeService employeeService,
            IOrderService orderService,
            IOrderDetailService orderDetailService,
            IPatientService patientService)
        {
            _employeeService = employeeService;
            _orderService = orderService;
            _orderDetailService = orderDetailService;
            _patientService = patientService;
        }

        private EmployeeRole? GetRequesterRole()
        {
            if (User.Identity == null || !User.Identity.IsAuthenticated)
                return null;

            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(roleClaim) || !Enum.TryParse<EmployeeRole>(roleClaim, out var role))
                return null;

            return role;
        }

        // GET: /StaffDashboard
        public async Task<IActionResult> Index()
        {
            var currentRole = GetRequesterRole();
            if (currentRole == null)
                return Unauthorized("Access Denied: Staff role required.");

            var allStaff = await _employeeService.GetAllAsync();
            var activeStaff = await _employeeService.GetActiveEmployeesAsync();
            var admins = await _employeeService.GetByRoleAsync(EmployeeRole.Admin);
            var technicians = await _employeeService.GetByRoleAsync(EmployeeRole.Technician);
            var receptionists = await _employeeService.GetByRoleAsync(EmployeeRole.Receptionist);
            var allOrders = await _orderService.GetAllWithDetailsAsync();
            var completedStats = await _orderDetailService.GetCompletedTestStatsAsync();

            var allPatients = await _patientService.GetAllAsync();
            var patientLookup = allPatients.ToDictionary(p => p.PatientID, p => p.FullName);

            var viewModel = new StaffDashboardViewModel
            {
                PendingOrders = allOrders.Count(o => o.Status == OrderStatus.Pending),
                InProgressOrders = allOrders.Count(o => o.Status == OrderStatus.Pending),
                CompletedToday = allOrders.Count(o => o.Status == OrderStatus.Completed && o.OrderDate.Date == DateTime.Today),
                TotalLabTests = allOrders.Sum(o => o.OrderDetails?.Count ?? 0),
                PendingOrdersList = allOrders
                    .Where(o => o.Status == OrderStatus.Pending)
                    .Select(o =>
                    {
                        patientLookup.TryGetValue(o.PatientID, out var patientName);
                        return new PendingOrder
                        {
                            OrderID = BitConverter.ToInt32(o.OrderID.ToByteArray(), 0) & 0x7FFFFFFF,
                            PatientName = patientName ?? $"Patient-{o.PatientID.ToString().Substring(0, 8)}",
                            OrderDate = o.OrderDate,
                            TestCount = o.OrderDetails?.Count ?? 0
                        };
                    }).ToList(),
                LabTestStats = completedStats.Select(s => new LabTestStat
                {
                    TestName = s.TestName,
                    TotalPerformed = s.TotalPerformed,
                    AverageTurnaround = s.AverageTurnaround
                }).ToList()
            };

            return View(viewModel);
        }

        // GET: /StaffDashboard/Active
        public async Task<IActionResult> Active()
        {
            var currentRole = GetRequesterRole();
            if (currentRole == null)
                return Unauthorized("Access Denied: Staff role required.");

            var activeStaff = await _employeeService.GetActiveEmployeesAsync();
            return View(activeStaff);
        }

        // GET: /StaffDashboard/Role/{role}
        public async Task<IActionResult> ByRole(EmployeeRole role)
        {
            var currentRole = GetRequesterRole();
            if (currentRole == null)
                return Unauthorized("Access Denied: Staff role required.");

            var staff = await _employeeService.GetByRoleAsync(role);
            return View(staff);
        }

        // GET: /StaffDashboard/Deactivate/{id}
        public async Task<IActionResult> Deactivate(Guid id)
        {
            var currentRole = GetRequesterRole();
            if (currentRole != EmployeeRole.Admin)
                return Unauthorized("Access Denied: Admin role required.");

            var result = await _employeeService.DeactivateAsync(id, currentRole.Value);
            return RedirectToAction(nameof(Index));
        }

        // GET: /StaffDashboard/Activate/{id}
        public async Task<IActionResult> Activate(Guid id)
        {
            var currentRole = GetRequesterRole();
            if (currentRole != EmployeeRole.Admin)
                return Unauthorized("Access Denied: Admin role required.");

            var result = await _employeeService.ActivateAsync(id, currentRole.Value);
            return RedirectToAction(nameof(Index));
        }
    }
}
