using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class EnrollmentRequest
    {
        public int CourseID { get; set; }
        public string Feedback { get; set; }
    }
}