using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class User
    {
        public int UserID { get; set; }

        [RegularExpression(@"^[a-zA-ZıİçÇşŞğĞüÜöÖ]+$", ErrorMessage = "Ad ve soyad sadece harflerden oluşmalıdır.")]
        public string FirstName { get; set; }

        [RegularExpression(@"^[a-zA-ZıİçÇşŞğĞüÜöÖ]+$", ErrorMessage = "Ad ve soyad sadece harflerden oluşmalıdır.")]

        public string LastName { get; set; }

        public int? Age { get; set; }

        [Required(ErrorMessage = "E-posta gerekli")]
        [EmailAddress(ErrorMessage = "Geçersiz e-posta adresi")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Şifre gerekli")]
        public string Password { get; set; }

        [Phone(ErrorMessage = "Geçersiz telefon numarası")]
        public string Phone { get; set; }
        public string? ProfileImageUrl { get; set; }

        [Required(ErrorMessage = "Platform kullanımı gerekli")]
        public DateTime CreatedAt { get; set; }
        public string PlatformUsage { get; set; }
        public User()
        {
            CreatedAt = DateTime.UtcNow;
        }
        

    }
}