using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class RateCourseRequest
    {
        public int CourseID { get; set; }
        public double Rating { get; set; } // Kullanıcıdan alınan rating değeri

    }
}