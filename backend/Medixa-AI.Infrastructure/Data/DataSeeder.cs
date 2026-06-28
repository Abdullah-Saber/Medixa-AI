using BCrypt.Net;
using Medixa_AI.Domain.Entities;
using Medixa_AI.Domain.Enums;
using Medixa_AI.Infrastructure.Persistence;

namespace Medixa_AI.Infrastructure.Data
{
    public static class DataSeeder
    {
        public static async Task SeedData(AppDbContext context)
        {
            // Check if data already exists - skip seeding if data exists
            if (context.Employees.Any())
            {
                Console.WriteLine("Data already exists, skipping seeding.");
                return;
            }

            // Seed Employees
            var adminEmployee = new Employee
            {
                EmployeeID = Guid.NewGuid(),
                FullName = "Admin User",
                Role = EmployeeRole.Admin,
                Phone = "1234567890",
                Email = "admin@medixa.com",
                PasswordHash = HashPassword("Admin123"),
                Salary = 10000,
                HireDate = DateTime.Now.AddYears(-2),
                IsActive = true
            };

            var technicianEmployee = new Employee
            {
                EmployeeID = Guid.NewGuid(),
                FullName = "Tech User",
                Role = EmployeeRole.Technician,
                Phone = "0987654321",
                Email = "tech@medixa.com",
                PasswordHash = HashPassword("Tech123"),
                Salary = 5000,
                HireDate = DateTime.Now.AddYears(-1),
                IsActive = true
            };

            var receptionistEmployee = new Employee
            {
                EmployeeID = Guid.NewGuid(),
                FullName = "Reception User",
                Role = EmployeeRole.Receptionist,
                Phone = "5555555555",
                Email = "reception@medixa.com",
                PasswordHash = HashPassword("Reception123"),
                Salary = 4000,
                HireDate = DateTime.Now.AddMonths(-6),
                IsActive = true
            };

            context.Employees.AddRange(adminEmployee, technicianEmployee, receptionistEmployee);
            await context.SaveChangesAsync();

            // Seed LabTests
            var bloodTest = new LabTest
            {
                TestID = Guid.NewGuid(),
                TestName = "Complete Blood Count",
                Description = "Full blood panel analysis",
                Category = "Hematology",
                Price = 50,
                SampleType = "Blood",
                Unit = "cells/L",
                IsActive = true
            };

            var urineTest = new LabTest
            {
                TestID = Guid.NewGuid(),
                TestName = "Urine Analysis",
                Description = "Complete urine examination",
                Category = "Clinical Chemistry",
                Price = 30,
                SampleType = "Urine",
                Unit = "various",
                IsActive = true
            };

            var xrayTest = new LabTest
            {
                TestID = Guid.NewGuid(),
                TestName = "Chest X-Ray",
                Description = "Radiographic imaging of chest",
                Category = "Radiology",
                Price = 100,
                SampleType = "Imaging",
                Unit = "images",
                IsActive = true
            };

            context.LabTests.AddRange(bloodTest, urineTest, xrayTest);
            await context.SaveChangesAsync();

            // Seed Specialization
            var generalSpecialization = new Specialization
            {
                Name = "General Medicine",
                Description = "General medical practice"
            };

            context.Specializations.Add(generalSpecialization);
            await context.SaveChangesAsync();

            // Seed Doctor
            var doctor = new Doctor
            {
                DoctorID = Guid.NewGuid(),
                FullName = "Dr. Smith",
                SpecializationID = generalSpecialization.SpecializationID,
                Phone = "1111111111",
                Email = "drsmith@medixa.com",
                ClinicName = "Medixa Clinic",
                IsActive = true
            };

            context.Doctors.Add(doctor);
            await context.SaveChangesAsync();

            // Seed Patient
            var patient = new Patient
            {
                PatientID = Guid.NewGuid(),
                FullName = "John Doe",
                NationalID = "12345678901234",
                Phone = "2222222222",
                Email = "johndoe@example.com",
                Gender = Gender.Male,
                DateOfBirth = new DateOnly(1980, 1, 1),
                Address = "123 Main St",
                BloodType = "O+",
                RegistrationDate = DateTime.Now,
                IsActive = true
            };

            context.Patients.Add(patient);
            await context.SaveChangesAsync();

            // Seed Order
            var order = new TestOrder
            {
                OrderID = Guid.NewGuid(),
                PatientID = patient.PatientID,
                DoctorID = doctor.DoctorID,
                OrderDate = DateTime.Now,
                TotalAmount = 180,
                Status = OrderStatus.Pending,
                Notes = "Routine checkup",
                CreatedByEmployeeID = receptionistEmployee.EmployeeID,
                CreatedAt = DateTime.Now
            };

            context.TestOrders.Add(order);
            await context.SaveChangesAsync();

            // Seed OrderDetails
            var orderDetail1 = new OrderDetail
            {
                OrderDetailID = Guid.NewGuid(),
                OrderID = order.OrderID,
                TestID = bloodTest.TestID,
                Price = 50,
                Status = TestStatus.Pending,
                IsAbnormal = false
            };

            var orderDetail2 = new OrderDetail
            {
                OrderDetailID = Guid.NewGuid(),
                OrderID = order.OrderID,
                TestID = urineTest.TestID,
                Price = 30,
                Status = TestStatus.Pending,
                IsAbnormal = false
            };

            var orderDetail3 = new OrderDetail
            {
                OrderDetailID = Guid.NewGuid(),
                OrderID = order.OrderID,
                TestID = xrayTest.TestID,
                Price = 100,
                Status = TestStatus.Pending,
                IsAbnormal = false
            };

            context.OrderDetails.AddRange(orderDetail1, orderDetail2, orderDetail3);
            await context.SaveChangesAsync();

            Console.WriteLine("Test data seeded successfully.");
            Console.WriteLine($"Admin ID: {adminEmployee.EmployeeID}");
            Console.WriteLine($"Technician ID: {technicianEmployee.EmployeeID}");
            Console.WriteLine($"Patient ID: {patient.PatientID}");
            Console.WriteLine($"Order ID: {order.OrderID}");
            Console.WriteLine($"OrderDetail IDs: {orderDetail1.OrderDetailID}, {orderDetail2.OrderDetailID}, {orderDetail3.OrderDetailID}");
        }

        private static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
