using System.ComponentModel.DataAnnotations;

namespace patient_lifeCycle.Models
{
    public class Specialization
    {
        [Key]
        public int SpecializationID { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = null!;

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<Doctor> Doctors { get; set; } = new HashSet<Doctor>();
        public ICollection<TestMedicalRule> MedicalRules { get; set; } = new HashSet<TestMedicalRule>();
        public ICollection<AIInterpretation> AIInterpretations { get; set; } = new HashSet<AIInterpretation>();
    }
}