using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class CommentRequest
    {
        public int CourseID { get; set; } // Kurs ID'si
        public string Content { get; set; } // Yorum içeriği
        public int? FeedbackID { get; set; } // Opsiyonel Geri Bildirim ID'si
        public int UserID { get; set; } // Kullanıcı ID'si (Guid formatında olabilir)
    }
}