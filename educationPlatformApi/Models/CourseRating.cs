using System;
using System.ComponentModel.DataAnnotations;

namespace educationPlatformApi.Models
{
    public class CourseRating
    {
        public int RatingID { get; set; } // Primary Key

        public int CourseID { get; set; } // Related Course

        public int StudentID { get; set; } // Rating yapan öğrenci (UserID yerine StudentID)

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public double Rating { get; set; } // Rating Value (1-5)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp

        // Navigation Properties
        public Course Course { get; set; }
        public Student Student { get; set; } // Rating yapan öğrenci
    }
}
