using Medixa_AI.Application.Interfaces;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace Medixa_AI.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
        {
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            return services;
        }
    }
}
