using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NotificationID { get; set; }

        public string Message { get; set; } // Bildirim mesajı
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Oluşturulma tarihi

        public bool IsRead { get; set; } = false; // Okundu mu?

        [ForeignKey("User")]
        public int InstructorID { get; set; }
        public virtual Instructor Instructor { get; set; } // Kullanıcı ile ilişki
        public void MarkAsRead()
        {
            IsRead = true;
        }

    }
}