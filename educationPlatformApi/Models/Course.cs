using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace educationPlatformApi.Models
{
    public class Course
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CourseID { get; set; }

        [Required]
        [MaxLength(100)] // Kurs isminin uzunluğunu sınırlamak için
        public string Name { get; set; }

        [MaxLength(500)] // Açıklamanın uzunluğunu sınırlamak için
        public string Description { get; set; }

        public string ImageUrl { get; set; } // Resim dosyasının yolu

        public string? VideoPath { get; set; } // Video dosyasının yolu
        public bool IsActive { get; set; } = true;

        public double AverageRating { get; set; }

        public int EnrollmentCount => Enrollments.Count;
        [ForeignKey("Instructor")]
        public int InstructorID { get; set; }

        public virtual Instructor Instructor { get; set; }

        [ForeignKey("Category")]
        public int CategoryID { get; set; } // Kursun kategorisi

        public virtual Category Category { get; set; }


        // Eğitimleri tutacak olan ilişki
        public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

        public virtual ICollection<FeedBack> Feedbacks { get; set; } = new List<FeedBack>
        (); // Geri bildirimler
        public ICollection<CourseRating> Ratings { get; set; }
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
