using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace educationPlatformApi.Models
{
    public class Instructor :User
    {
        [MaxLength(100)]
        public string? Specialty { get; set; }  // Eğitmenin uzmanlık alanı

        public string? Bio { get; set; }  // Eğitmenin biyografisi

        [Range(0.0, 5.0)]
        public double AverageRating { get; set; } = 0.0;  // Eğitmenin ortalama puanı

        // Eğitmen puan ortalamasını güncelleyen metod
        public void UpdateAverageRating()
        {
            AverageRating = Feedbacks?.Where(f => f.Rating > 0).Average(f => f.Rating) ?? 0.0;
        }

        // Öğrenciler ile ilişki: Bir eğitmenin birden fazla öğrencisi olabilir
        public virtual ICollection<Student> Students { get; set; } = new List<Student>();

        // Kurslar ile ilişki: Eğitmenlerin birden fazla kursu olabilir
        public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

        // Yorumlar ile ilişki: Eğitmenlere ait birden fazla yorum olabilir
        public virtual ICollection<FeedBack> Feedbacks { get; set; } = new List<FeedBack>();
    }
}
