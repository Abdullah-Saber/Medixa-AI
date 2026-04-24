using Medixa_AI.Application.Interfaces;
using Medixa_AI.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Medixa_AI.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<IDoctorService, DoctorService>();
            services.AddScoped<ISpecializationService, SpecializationService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IResultService, ResultService>();

            return services;
        }
    }
}
