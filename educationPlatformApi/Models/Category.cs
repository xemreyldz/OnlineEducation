using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CategoryID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } // Kategori adı
        [MaxLength(50)]
        public string Url { get; set; }
   
        public virtual ICollection<Course> Courses { get; set; } // Kategoriye ait kurslar
            
        }
}