using Medixa_AI.Application.DTOs;
using Medixa_AI.Application.Interfaces;
using Medixa_AI.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Medixa_AI.Api.Controllers.Mvc
{
    public class StaffDashboardController : Controller
    {
        private readonly IEmployeeService _employeeService;

        public StaffDashboardController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // GET: /StaffDashboard
        public async Task<IActionResult> Index()
        {
            var allStaff = await _employeeService.GetAllAsync();
            var activeStaff = await _employeeService.GetActiveEmployeesAsync();
            var admins = await _employeeService.GetByRoleAsync(EmployeeRole.Admin);
            var technicians = await _employeeService.GetByRoleAsync(EmployeeRole.Technician);
            var receptionists = await _employeeService.GetByRoleAsync(EmployeeRole.Receptionist);

            var viewModel = new StaffDashboardViewModel
            {
                AllStaff = allStaff,
                ActiveStaff = activeStaff,
                AdminCount = admins.Count(),
                TechnicianCount = technicians.Count(),
                ReceptionistCount = receptionists.Count(),
                InactiveCount = allStaff.Count() - activeStaff.Count()
            };

            return View(viewModel);
        }

        // GET: /StaffDashboard/Active
        public async Task<IActionResult> Active()
        {
            var activeStaff = await _employeeService.GetActiveEmployeesAsync();
            return View(activeStaff);
        }

        // GET: /StaffDashboard/Role/{role}
        public async Task<IActionResult> ByRole(EmployeeRole role)
        {
            var staff = await _employeeService.GetByRoleAsync(role);
            return View(staff);
        }

        // GET: /StaffDashboard/Deactivate/{id}
        public async Task<IActionResult> Deactivate(Guid id)
        {
            // TODO: Replace with authenticated user role (JWT/Claims)
            var currentRole = EmployeeRole.Admin;
            var result = await _employeeService.DeactivateAsync(id, currentRole);
            return RedirectToAction(nameof(Index));
        }

        // GET: /StaffDashboard/Activate/{id}
        public async Task<IActionResult> Activate(Guid id)
        {
            // TODO: Replace with authenticated user role (JWT/Claims)
            var currentRole = EmployeeRole.Admin;
            var result = await _employeeService.ActivateAsync(id, currentRole);
            return RedirectToAction(nameof(Index));
        }
    }

    public class StaffDashboardViewModel
    {
        public IEnumerable<EmployeeDto> AllStaff { get; set; } = new List<EmployeeDto>();
        public IEnumerable<EmployeeDto> ActiveStaff { get; set; } = new List<EmployeeDto>();
        public int AdminCount { get; set; }
        public int TechnicianCount { get; set; }
        public int ReceptionistCount { get; set; }
        public int InactiveCount { get; set; }
    }
}
