using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class UpdateInstructorRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Age { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? Specialty { get; set; }  // Eğitmen uzmanlık alanı
        public string? Bio { get; set; }        // Eğitmen biyografisi

    }
}