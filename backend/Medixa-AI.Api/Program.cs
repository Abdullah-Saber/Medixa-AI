using Medixa_AI.Application;
using Medixa_AI.Infrastructure;
using Medixa_AI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Add MVC (for dashboards)
builder.Services.AddControllersWithViews();

// 🔹 Add API Controllers (for React)
builder.Services.AddControllers();

// 🔹 Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Medixa AI API", Version = "v1" });
});

// 🔹 Register DbContext (Infrastructure)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🔹 Register Infrastructure Services
builder.Services.AddInfrastructureServices();

// 🔹 Register Application Services
builder.Services.AddApplicationServices();

// 🔹 Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// 🔹 Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowReactApp");

app.UseAuthorization();

// 🔹 Map MVC routes (dashboards)
app.MapControllerRoute(
    name: "mvc",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// 🔹 Map API routes (for React)
app.MapControllers();

app.Run();