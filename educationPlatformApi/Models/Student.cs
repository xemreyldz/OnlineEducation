using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace educationPlatformApi.Models
{
    public class Student : User
    {

        public string? School { get; set; }



        public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
        public virtual ICollection<FeedBack> Feedbacks { get; set; } = new List<FeedBack>();
        public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public virtual ICollection<Comment>? Comments { get; set; }
        public virtual ICollection<CourseRating> Ratings { get; set; } = new List<CourseRating>();

    }
}
