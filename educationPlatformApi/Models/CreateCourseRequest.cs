using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace educationPlatformApi.Models
{
    public class CreateCourseRequest
    {
        
        public string Name { get; set; }
        
        public string Description { get; set; }
        public int CategoryID { get; set; }

    }
}