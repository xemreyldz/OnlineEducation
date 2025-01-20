using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class UpdateCourseRequest
    {      
            public string Name { get; set; }
            public string Description { get; set; }
            public IFormFile? Image { get; set; } // Görsel dosyası
        

    }
}