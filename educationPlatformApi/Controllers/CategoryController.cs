using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using educationPlatformApi.Data;
using educationPlatformApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace educationPlatformApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(ApplicationDbContext context, ILogger<CategoryController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var categories = await _context.Categories.ToListAsync();


                if (categories.Count == 0)
                {
                    _logger.LogInformation("Kategoriler bulunamadı.");
                    return NotFound("Kategoriler bulunamadı.");
                }

                return Ok(categories);
            }
            catch (Exception ex)
            {

                _logger.LogError($"Kategoriler getirilirken bir hata oluştu: {ex.Message}");
                return StatusCode(500, "Sunucu hatası oluştu.");
            }
        }

        [HttpGet("byCategory/{categoryId}")]
        public async Task<ActionResult<List<object>>> GetCoursesByCategory(int categoryId)
        {
            try
            {
                var courses = await _context.Courses
                    .Include(c => c.Instructor)
                    .Include(r => r.Ratings)
                    .Where(c => c.CategoryID == categoryId) // Kategoriye göre filtreleme
                    .Select(c => new
                    {
                        c.CourseID,
                        c.Name,
                        c.Description,
                        c.ImageUrl,
                        InstructorName = c.Instructor.FirstName,
                        InstructorSurname = c.Instructor.LastName,
                        ProfileImage = c.Instructor.ProfileImageUrl,
                        AverageRating = c.Ratings.Any() ? c.Ratings.Average(r => r.Rating) : 0
                    })
                    .ToListAsync();

                if (!courses.Any())
                {
                    return NotFound("Bu kategoriye ait kurs bulunamadı.");
                }

                return Ok(courses);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hata: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                return StatusCode(500, "Internal server error");
            }
        }


    }



}
