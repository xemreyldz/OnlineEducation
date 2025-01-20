using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class CourseRequest
    {
        public int CourseID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string InstructorName { get; set; }
        public string InstructorSurname { get; set; }
    }
}