using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace educationPlatformApi.Models
{
    public class FeedBack
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FeedbackID { get; set; } // Geri bildirim ID'si

        [ForeignKey("Course")]
        public int CourseID { get; set; } // Kurs ID'si
        public virtual Course Course { get; set; } // Kurs ile ilişki

        [ForeignKey("User")]
        public int StudentID { get; set; } // Yorum yapan öğrenci
        public virtual Student Student { get; set; } // Öğrenci ile ilişki

        [Range(1, 5, ErrorMessage = "Derecelendirme 1 ile 5 arasında olmalıdır.")]
        public int Rating { get; set; } // Derecelendirme (1-5)

        public DateTime FeedbackDate { get; set; } = DateTime.UtcNow; // Yorum tarihi, varsayılan olarak UTC zamanı

        // Yorumları ilişkilendiriyoruz
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>(); // Yorumlar

        [ForeignKey("Instructor")] // Eğitmen ile ilişkiyi belirtin
        public int InstructorID { get; set; } // Eğitmenin ID'si
        public virtual Instructor Instructor { get; set; } // Eğitmen bilgisi
    }
}
