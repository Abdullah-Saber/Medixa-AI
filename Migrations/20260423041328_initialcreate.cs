using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace patient_lifeCycle.Migrations
{
    /// <inheritdoc />
    public partial class initialcreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmployeeID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Salary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HireDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeID);
                });

            migrationBuilder.CreateTable(
                name: "LabTests",
                columns: table => new
                {
                    TestID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SampleType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabTests", x => x.TestID);
                });

            migrationBuilder.CreateTable(
                name: "MembershipCategories",
                columns: table => new
                {
                    CategoryID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CategoryName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DiscountPercentage = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    PointsMultiplier = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MembershipCategories", x => x.CategoryID);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    PatientID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NationalID = table.Column<string>(type: "nvarchar(14)", maxLength: 14, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    BloodType = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.PatientID);
                });

            migrationBuilder.CreateTable(
                name: "Specializations",
                columns: table => new
                {
                    SpecializationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specializations", x => x.SpecializationID);
                });

            migrationBuilder.CreateTable(
                name: "TestCheckupPolicies",
                columns: table => new
                {
                    PolicyID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RecommendedEveryMonths = table.Column<int>(type: "int", nullable: false),
                    IsMandatoryForAgeAbove = table.Column<int>(type: "int", nullable: true),
                    IsMandatoryForGender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestCheckupPolicies", x => x.PolicyID);
                    table.ForeignKey(
                        name: "FK_TestCheckupPolicies_LabTests_TestID",
                        column: x => x.TestID,
                        principalTable: "LabTests",
                        principalColumn: "TestID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TestNormalRanges",
                columns: table => new
                {
                    RangeID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MinAge = table.Column<int>(type: "int", nullable: false),
                    MaxAge = table.Column<int>(type: "int", nullable: false),
                    MinValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestNormalRanges", x => x.RangeID);
                    table.ForeignKey(
                        name: "FK_TestNormalRanges_LabTests_TestID",
                        column: x => x.TestID,
                        principalTable: "LabTests",
                        principalColumn: "TestID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TestPrerequisites",
                columns: table => new
                {
                    PrerequisiteID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstructionText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FastingHours = table.Column<int>(type: "int", nullable: true),
                    IsMandatory = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestPrerequisites", x => x.PrerequisiteID);
                    table.ForeignKey(
                        name: "FK_TestPrerequisites_LabTests_TestID",
                        column: x => x.TestID,
                        principalTable: "LabTests",
                        principalColumn: "TestID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    AppointmentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AppointmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Purpose = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReminderSent = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.AppointmentID);
                    table.ForeignKey(
                        name: "FK_Appointments_Patients_PatientID",
                        column: x => x.PatientID,
                        principalTable: "Patients",
                        principalColumn: "PatientID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CheckupRecommendations",
                columns: table => new
                {
                    RecommendationID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SuggestedDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheckupRecommendations", x => x.RecommendationID);
                    table.ForeignKey(
                        name: "FK_CheckupRecommendations_LabTests_TestID",
                        column: x => x.TestID,
                        principalTable: "LabTests",
                        principalColumn: "TestID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CheckupRecommendations_Patients_PatientID",
                        column: x => x.PatientID,
                        principalTable: "Patients",
                        principalColumn: "PatientID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HealthMetricSnapshots",
                columns: table => new
                {
                    SnapshotID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LastValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TrendType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CalculatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthMetricSnapshots", x => x.SnapshotID);
                    table.ForeignKey(
                        name: "FK_HealthMetricSnapshots_LabTests_TestID",
                        column: x => x.TestID,
                        principalTable: "LabTests",
                        principalColumn: "TestID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HealthMetricSnapshots_Patients_PatientID",
                        column: x => x.PatientID,
                        principalTable: "Patients",
                        principalColumn: "PatientID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PatientMemberships",
                columns: table => new
                {
                    MembershipID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CategoryID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PointsBalance = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ExpiryDate = table.Column<DateOnly>(type: "date", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientMemberships", x => x.MembershipID);
                    table.ForeignKey(
                        name: "FK_PatientMemberships_MembershipCategories_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "MembershipCategories",
                        principalColumn: "CategoryID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PatientMemberships_Patients_PatientID",
                        column: x => x.PatientID,
                        principalTable: "Patients",
                        principalColumn: "PatientID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UploadedMedicalFiles",
                columns: table => new
                {
                    FileID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ExtractedText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Processed = table.Column<bool>(type: "bit", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UploadedMedicalFiles", x => x.FileID);
                    table.ForeignKey(
                        name: "FK_UploadedMedicalFiles_Patients_PatientID",
                        column: x => x.PatientID,
                        principalTable: "Patients",
                        principalColumn: "PatientID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Doctors",
                columns: table => new
                {
                    DoctorID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SpecializationID = table.Column<int>(type: "int", nullable: false),
                    ClinicName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctors", x => x.DoctorID);
                    table.ForeignKey(
                        name: "FK_Doctors_Specializations_SpecializationID",
                        column: x => x.SpecializationID,
                        principalTable: "Specializations",
                        principalColumn: "SpecializationID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TestMedicalRules",
                columns: table => new
                {
                    RuleID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MinAge = table.Column<int>(type: "int", nullable: true),
                    MaxAge = table.Column<int>(type: "int", nullable: true),
                    MinValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RiskLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdviceText = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    SuggestedSpecializationID = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestMedicalRules", x => x.RuleID);
                    table.ForeignKey(
                        name: "FK_TestMedicalRules_LabTests_TestID",
                        column: x => x.TestID,
                        principalTable: "LabTests",
                        principalColumn: "TestID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TestMedicalRules_Specializations_SuggestedSpecializationID",
                        column: x => x.SuggestedSpecializationID,
                        principalTable: "Specializations",
                        principalColumn: "SpecializationID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TestOrders",
                columns: table => new
                {
                    OrderID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DoctorID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedByEmployeeID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestOrders", x => x.OrderID);
                    table.ForeignKey(
                        name: "FK_TestOrders_Doctors_DoctorID",
                        column: x => x.DoctorID,
                        principalTable: "Doctors",
                        principalColumn: "DoctorID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TestOrders_Employees_CreatedByEmployeeID",
                        column: x => x.CreatedByEmployeeID,
                        principalTable: "Employees",
                        principalColumn: "EmployeeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TestOrders_Patients_PatientID",
                        column: x => x.PatientID,
                        principalTable: "Patients",
                        principalColumn: "PatientID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderDetails",
                columns: table => new
                {
                    OrderDetailID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrderID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsAbnormal = table.Column<bool>(type: "bit", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDetails", x => x.OrderDetailID);
                    table.ForeignKey(
                        name: "FK_OrderDetails_LabTests_TestID",
                        column: x => x.TestID,
                        principalTable: "LabTests",
                        principalColumn: "TestID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderDetails_TestOrders_OrderID",
                        column: x => x.OrderID,
                        principalTable: "TestOrders",
                        principalColumn: "OrderID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrderID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AmountPaid = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TransactionReference = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.PaymentID);
                    table.ForeignKey(
                        name: "FK_Payments_TestOrders_OrderID",
                        column: x => x.OrderID,
                        principalTable: "TestOrders",
                        principalColumn: "OrderID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TestResults",
                columns: table => new
                {
                    ResultID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrderDetailID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResultValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ResultText = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ResultDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TechnicianID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestResults", x => x.ResultID);
                    table.ForeignKey(
                        name: "FK_TestResults_Employees_TechnicianID",
                        column: x => x.TechnicianID,
                        principalTable: "Employees",
                        principalColumn: "EmployeeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TestResults_OrderDetails_OrderDetailID",
                        column: x => x.OrderDetailID,
                        principalTable: "OrderDetails",
                        principalColumn: "OrderDetailID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AIInterpretations",
                columns: table => new
                {
                    InterpretationID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResultID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RiskLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SummaryText = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    SuggestedSpecializationID = table.Column<int>(type: "int", nullable: true),
                    GeneratedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AIInterpretations", x => x.InterpretationID);
                    table.ForeignKey(
                        name: "FK_AIInterpretations_Specializations_SuggestedSpecializationID",
                        column: x => x.SuggestedSpecializationID,
                        principalTable: "Specializations",
                        principalColumn: "SpecializationID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AIInterpretations_TestResults_ResultID",
                        column: x => x.ResultID,
                        principalTable: "TestResults",
                        principalColumn: "ResultID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AIInterpretations_ResultID",
                table: "AIInterpretations",
                column: "ResultID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AIInterpretations_SuggestedSpecializationID",
                table: "AIInterpretations",
                column: "SuggestedSpecializationID");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_PatientID",
                table: "Appointments",
                column: "PatientID");

            migrationBuilder.CreateIndex(
                name: "IX_CheckupRecommendations_PatientID",
                table: "CheckupRecommendations",
                column: "PatientID");

            migrationBuilder.CreateIndex(
                name: "IX_CheckupRecommendations_TestID",
                table: "CheckupRecommendations",
                column: "TestID");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_Email",
                table: "Doctors",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_SpecializationID",
                table: "Doctors",
                column: "SpecializationID");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_HealthMetricSnapshots_PatientID",
                table: "HealthMetricSnapshots",
                column: "PatientID");

            migrationBuilder.CreateIndex(
                name: "IX_HealthMetricSnapshots_TestID",
                table: "HealthMetricSnapshots",
                column: "TestID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_OrderID",
                table: "OrderDetails",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_TestID",
                table: "OrderDetails",
                column: "TestID");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMemberships_CategoryID",
                table: "PatientMemberships",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMemberships_PatientID",
                table: "PatientMemberships",
                column: "PatientID");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_NationalID",
                table: "Patients",
                column: "NationalID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_OrderID",
                table: "Payments",
                column: "OrderID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TestCheckupPolicies_TestID",
                table: "TestCheckupPolicies",
                column: "TestID");

            migrationBuilder.CreateIndex(
                name: "IX_TestMedicalRules_SuggestedSpecializationID",
                table: "TestMedicalRules",
                column: "SuggestedSpecializationID");

            migrationBuilder.CreateIndex(
                name: "IX_TestMedicalRules_TestID",
                table: "TestMedicalRules",
                column: "TestID");

            migrationBuilder.CreateIndex(
                name: "IX_TestNormalRanges_TestID",
                table: "TestNormalRanges",
                column: "TestID");

            migrationBuilder.CreateIndex(
                name: "IX_TestOrders_CreatedByEmployeeID",
                table: "TestOrders",
                column: "CreatedByEmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_TestOrders_DoctorID",
                table: "TestOrders",
                column: "DoctorID");

            migrationBuilder.CreateIndex(
                name: "IX_TestOrders_PatientID",
                table: "TestOrders",
                column: "PatientID");

            migrationBuilder.CreateIndex(
                name: "IX_TestPrerequisites_TestID",
                table: "TestPrerequisites",
                column: "TestID");

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_OrderDetailID",
                table: "TestResults",
                column: "OrderDetailID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_TechnicianID",
                table: "TestResults",
                column: "TechnicianID");

            migrationBuilder.CreateIndex(
                name: "IX_UploadedMedicalFiles_PatientID",
                table: "UploadedMedicalFiles",
                column: "PatientID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AIInterpretations");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "CheckupRecommendations");

            migrationBuilder.DropTable(
                name: "HealthMetricSnapshots");

            migrationBuilder.DropTable(
                name: "PatientMemberships");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "TestCheckupPolicies");

            migrationBuilder.DropTable(
                name: "TestMedicalRules");

            migrationBuilder.DropTable(
                name: "TestNormalRanges");

            migrationBuilder.DropTable(
                name: "TestPrerequisites");

            migrationBuilder.DropTable(
                name: "UploadedMedicalFiles");

            migrationBuilder.DropTable(
                name: "TestResults");

            migrationBuilder.DropTable(
                name: "MembershipCategories");

            migrationBuilder.DropTable(
                name: "OrderDetails");

            migrationBuilder.DropTable(
                name: "LabTests");

            migrationBuilder.DropTable(
                name: "TestOrders");

            migrationBuilder.DropTable(
                name: "Doctors");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Specializations");
        }
    }
}
