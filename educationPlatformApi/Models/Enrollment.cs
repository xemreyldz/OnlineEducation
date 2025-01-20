using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class Enrollment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EnrollmentID { get; set; }

        [ForeignKey("User")]
        public int StudentID { get; set; }
        public virtual Student Student { get; set; } // Kullanıcı ile ilişki

        [ForeignKey("Course")]
        public int CourseID { get; set; }
        public virtual Course Course { get; set; } // Kurs ile ilişki
        public bool IsActive { get; set; } = true; // Kayıt durumu
        [MaxLength(1000, ErrorMessage = "Geri bildirim metni en fazla 1000 karakter olmalıdır.")]
        public string? Feedback { get; set; }

        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow; // Varsayılan tarih



    }
}