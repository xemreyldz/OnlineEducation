using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace educationPlatformApi.Models
{
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CommentID { get; set; } // Yorum ID'si

        [ForeignKey("Feedback")]
        public int? FeedbackID { get; set; } // Yorumun bağlı olduğu geri bildirim
        public virtual FeedBack Feedback { get; set; } // Geri bildirim ile ilişki

        [ForeignKey("Student")]
        public int UserID { get; set; } // Yorum yapan kullanıcı (öğrenci)
        public virtual Student Student { get; set; } // Kullanıcı ile ilişki

        [ForeignKey("Course")]
        public int CourseID { get; set; } // Yorumun ait olduğu kurs
        public virtual Course Course { get; set; } // Kurs ile ilişki

        [Required(ErrorMessage = "Yorum metni gereklidir.")]
        [MaxLength(1000, ErrorMessage = "Yorum metni en fazla 1000 karakter olmalıdır.")]
        public string Content { get; set; } // Yorum metni

        // Yorumun oluşturulma tarihi. Varsayılan değer veritabanında atanabilir.
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Yorumun oluşturulma tarihi
    }
}
