using System.IO;
using System.Threading.Tasks;
using educationPlatformApi.Data;
using educationPlatformApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Cors;


namespace educationPlatformApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CourseController> _logger;
        private readonly IWebHostEnvironment _env;

        public CourseController(ILogger<CourseController> logger, ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _logger = logger;
            _env = env;
        }

        // Course oluştur
        [HttpPost("add")]
        public async Task<IActionResult> CreateCourse([FromForm] IFormFile file, [FromForm] CreateCourseRequest request, [FromForm] IFormFile video)
        {
            try
            {


                if (video == null || video.Length == 0)
                    return BadRequest("Lütfen bir dosya seçin.");

                var allowedVideoExtensions = new[] { ".mp4", ".avi", ".mov", ".ogg" };
                var extensionVideo = Path.GetExtension(video.FileName).ToLower();

                if (!allowedVideoExtensions.Contains(extensionVideo))
                    return BadRequest("Yalnızca .mp4, .avi, .mov ve .ogg dosya türleri desteklenmektedir.");

                var uploadVideo = Path.Combine(_env.WebRootPath, "videos");
                if (!Directory.Exists(uploadVideo))
                    Directory.CreateDirectory(uploadVideo);

                var uniqueVideoName = Guid.NewGuid().ToString() + extensionVideo;
                var videoPath = Path.Combine(uploadVideo, uniqueVideoName);

                using (var stream = new FileStream(videoPath, FileMode.Create))
                {
                    await video.CopyToAsync(stream);
                }


                if (file == null || file.Length == 0)
                    return BadRequest("Lütfen bir dosya seçin.");
                // Dosya türü ve boyut kontrolü
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(file.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                    return BadRequest("Yalnızca .jpg, .jpeg, .png ve .gif dosya türleri desteklenmektedir.");

                if (file.Length > 2 * 1024 * 1024)
                    return BadRequest("Dosya boyutu maksimum 2 MB olmalıdır.");

                // Sunucudaki yükleme dizinini oluşturma
                var uploadPath = Path.Combine(_env.WebRootPath, "images");
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                // Benzersiz bir dosya adı oluşturma
                var uniqueFileName = Guid.NewGuid().ToString() + extension;
                var filePath = Path.Combine(uploadPath, uniqueFileName);

                // Dosyayı kaydetme
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                // Authorization başlığındaki token'ı alıyoruz
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

                // JWT token'ını çözümlemek için JwtSecurityTokenHandler kullanıyoruz
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

                // nameidentifier claim'inden InstructorID'yi alıyoruz
                var instructorId = jsonToken?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                if (instructorId == null)
                    return Unauthorized("Geçersiz token veya InstructorID eksik.");



                // Veritabanına kaydetme
                var course = new Course
                {
                    ImageUrl = $"/images/{uniqueFileName}",
                    VideoPath = $"/videos/{uniqueVideoName}",
                    CategoryID = request.CategoryID,
                    Name = request.Name,
                    Description = request.Description,
                    InstructorID = int.Parse(instructorId)

                };


                _context.Courses.Add(course);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Kurs kayıt işleminiz başarılı.",

                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Resim yükleme sırasında bir hata oluştu.");
                return StatusCode(500, "Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
            }
        }


        // Instructora bağlı kursları cek
        [HttpGet()]
        public async Task<IActionResult> GetCoursesByInstructor()
        {
            try
            {
                // Authorization header'dan JWT token'ı alın
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

                // JWT token'ını çözümlemek için JwtSecurityTokenHandler kullanıyoruz
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

                if (jsonToken == null)
                {
                    return Unauthorized(new { Message = "Geçersiz token." });
                }

                // nameidentifier claim'inden InstructorID'yi alıyoruz
                var userId = jsonToken?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                var instructorName = jsonToken?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
                var instructorSurname = jsonToken?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value;

                var instructorId = int.Parse(userId);

                // Veritabanından sadece bu Instructor'a ait kursları al
                var courses = await _context.Courses
                    .Where(course => course.InstructorID == instructorId) // InstructorID'ye göre filtre
                    .Select(course => new CourseRequest
                    {
                        CourseID = course.CourseID,
                        Name = course.Name,
                        Description = course.Description,
                        ImageUrl = course.ImageUrl,
                        InstructorName = instructorName,
                        InstructorSurname = instructorSurname
                    })
                    .ToListAsync();

                if (courses.Count == 0)
                {
                    return NotFound(new { Message = "Bu eğitmene ait kurs bulunamadı." });
                }

                return Ok(courses);
            }
            catch (Exception ex)
            {
                // Hata loglama
                // _logger.LogError(ex, "GetCoursesByInstructor error");
                return StatusCode(500, new { Message = "Veriler alınırken bir hata oluştu.", Error = ex.Message });
            }
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<object>>> GetCourses(int? categoryId = null)
        {
            try
            {
                var query = _context.Courses
                    .Include(c => c.Instructor)
                    .Include(r => r.Ratings)
                    .AsQueryable();

                if (categoryId.HasValue)
                {
                    query = query.Where(c => c.CategoryID == categoryId.Value);
                }

                var courses = await query
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
                    return NotFound("Kurs bulunamadı.");
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



        // CourseID göre kursu sil
        [HttpDelete("{courseID}")]
        public async Task<IActionResult> DeleteCourse(int courseID)
        {
            var course = await _context.Courses.FindAsync(courseID);
            if (course == null)
            {
                // Eğer kurs bulunamazsa 404 Not Found döneriz
                return NotFound(new { message = "Kurs bulunamadı" });
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return Ok("Kurs silme işleminiz başarılı !");


        }

        // id göre CourseID cek
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourseById(int id)
        {
            // Token'dan kullanıcı ID'sini al
            var userId = GetUserIdFromToken();
            if (!userId.HasValue)
            {
                return Unauthorized("Geçersiz veya eksik token.");
            }

            // Kurs verilerini veritabanından al
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Ratings)
                .Where(c => c.CourseID == id)
                .FirstOrDefaultAsync();

            if (course == null)
                return NotFound("Kurs bulunamadı.");

            // Kullanıcının değerlendirmesini bul
            var userRating = course.Ratings.FirstOrDefault(r => r.StudentID == userId)?.Rating;

            // Yanıt modelini oluştur
            var response = new
            {
                course.CourseID,
                course.Name,
                course.Description,
                course.ImageUrl,
                course.VideoPath,
                InstructorName = course.Instructor.FirstName,
                InstructorSurname = course.Instructor.LastName,
                InstructorSpecialty = course.Instructor.Specialty,
                ProfileImage = course.Instructor.ProfileImageUrl,
                AverageRating = course.Ratings.Any() ? course.Ratings.Average(r => r.Rating) : (double?)null,
                UserRating = userRating
            };

            return Ok(response);
        }


        // CourseID Göre güncelleme yap
        // ---------------------------------------------------------------------------------
        [HttpPut("{courseID}")]
        public async Task<IActionResult> UpdateCourse(int courseID, [FromForm] UpdateCourseRequest updateCourse)
        {
            // 1. Kursu Veritabanından Al
            var course = await _context.Courses.FindAsync(courseID);
            if (course == null)
            {
                return NotFound(new { message = "Kurs bulunamadı." });
            }

            // 2. Metin Alanlarını Güncelle
            course.Name = updateCourse.Name;
            course.Description = updateCourse.Description;

            // 3. Görsel Yükleme İşlemi
            if (updateCourse.Image != null)
            {
                // Görsel için bir dosya yolu belirleyin
                var fileName = $"{Guid.NewGuid()}_{updateCourse.Image.FileName}";
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await updateCourse.Image.CopyToAsync(stream);
                }

                // Eski görseli silmek isteyebilirsiniz:
                if (!string.IsNullOrEmpty(course.ImageUrl))
                {
                    var oldImagePath = Path.Combine("wwwroot", course.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                // Yeni görselin yolunu kaydedin
                course.ImageUrl = $"/images/{fileName}";
            }

            // 4. Veritabanını Güncelle
            _context.Courses.Update(course);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kurs başarıyla güncellendi." });
        }

        [HttpPost("rate")]
        public async Task<IActionResult> RateCourse([FromBody] RateCourseRequest request)
        {
            // Token doğrulama ve kullanıcı ID'sini alma
            var userId = GetUserIdFromToken();
            if (!userId.HasValue)
            {
                return Unauthorized("Geçersiz veya eksik token.");
            }

            // Kursu veritabanından bulma
            var course = await _context.Courses.FindAsync(request.CourseID);
            if (course == null)
            {
                return NotFound("Kurs bulunamadı.");
            }

            // Kullanıcının daha önce bu kurs için değerlendirme yapıp yapmadığını kontrol et
            var existingRating = await _context.CourseRatings
                .FirstOrDefaultAsync(r => r.StudentID == userId.Value && r.CourseID == request.CourseID);

            if (existingRating != null)
            {
                // Daha önce değerlendirme yapılmışsa, mevcut değeri güncelle
                existingRating.Rating = request.Rating;
                _context.CourseRatings.Update(existingRating);
            }
            else
            {
                // Yeni bir değerlendirme kaydı oluştur
                var newRating = new CourseRating
                {
                    CourseID = request.CourseID,
                    StudentID = userId.Value,
                    Rating = request.Rating
                };
                await _context.CourseRatings.AddAsync(newRating);
            }

            // Kursun ortalama puanını güncelle
            await UpdateCourseAverageRating(request.CourseID);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Kurs değerlendirme işlemi başarılı." });
        }

        private async Task UpdateCourseAverageRating(int courseId)
        {
            var course = await _context.Courses.Include(c => c.Ratings)
                .FirstOrDefaultAsync(c => c.CourseID == courseId);

            if (course != null && course.Ratings.Any())
            {
                course.AverageRating = course.Ratings.Average(r => r.Rating);
                _context.Courses.Update(course);
            }
        }

        private int? GetUserIdFromToken()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            var studentId = jsonToken?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(studentId, out int userId))
            {
                return userId;
            }

            return null;
        }

        [HttpPost("add-comment")]
        public async Task<IActionResult> AddComment([FromBody] CommentRequest commentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                // Kullanıcı ID'sini token'dan alıyoruz
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Geçersiz kullanıcı." });
                }

                int userId = int.Parse(userIdClaim.Value); // userID'yi int olarak alıyoruz


                // Student kontrolü
                var studentExists = await _context.Students.AnyAsync(s => s.UserID == userId);

                if (!studentExists)
                {
                    return NotFound(new { message = "Student bulunamadı." });
                }

                // Feedback kontrolü opsiyonel, yalnızca FeedbackID varsa kontrol edilmesi gerekir
                if (commentDto.FeedbackID.HasValue)
                {
                    var feedbackExists = await _context.Feedbacks.AnyAsync(f => f.FeedbackID == commentDto.FeedbackID);
                    if (!feedbackExists)
                    {
                        return NotFound(new { message = "Feedback bulunamadı." });
                    }
                }

                // Comment modelini DTO'dan oluşturuyoruz
                var comment = new Comment
                {
                    CourseID = commentDto.CourseID,
                    Content = commentDto.Content,
                    FeedbackID = commentDto.FeedbackID,  // Nullable olarak gidecek
                    UserID = userId, // Token'dan alınan userID
                    CreatedAt = DateTime.UtcNow
                };

                // Yorum ekleme
                await _context.Comments.AddAsync(comment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Yorum başarıyla eklendi.", comment });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Yorum eklenirken bir hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet("comments/{courseID}")]
        public async Task<IActionResult> GetComments(int courseID)
        {
            try
            {
                var comments = await _context.Comments
                    .Where(c => c.CourseID == courseID)
                    .OrderByDescending(c => c.CreatedAt)
                    .Include(c => c.Student)
                    .ToListAsync();

                if (comments == null || !comments.Any())
                {
                    return NotFound("Yorum bulunamadı.");
                }

                var result = comments.Select(c => new
                {
                    c.CommentID,
                    c.Content,
                    c.CreatedAt,
                    UserFirstName = c.Student.FirstName,
                    UserLastName = c.Student.LastName,
                    UserProfileImage = c.Student.ProfileImageUrl
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Hata loglama
                _logger.LogError(ex, "GetComments method failed.");
                return StatusCode(500, "Sunucu hatası oluştu.");
            }
        }



        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollStudent([FromBody] EnrollmentRequest request)
        {
            try
            {
                // Kullanıcı ID'sini token'dan alıyoruz
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Geçersiz kullanıcı." });
                }

                int userId = int.Parse(userIdClaim.Value); // userID'yi int olarak alıyoruz



                var user = await _context.Students.FindAsync(userId);
                var course = await _context.Courses.FindAsync(request.CourseID);

                if (user == null || course == null)
                    return BadRequest("Kullanıcı veya kurs bulunamadı.");

                // Zaten kayıtlı mı kontrol et
                var existingEnrollment = await _context.Enrollments
                    .FirstOrDefaultAsync(e => e.StudentID == userId && e.CourseID == request.CourseID);

                if (existingEnrollment != null)
                    return BadRequest("Kullanıcı zaten bu kursa kayıtlı.");

                var enrollment = new Enrollment
                {
                    StudentID = userId,
                    CourseID = request.CourseID,
                    Feedback = request.Feedback ?? string.Empty
                };

                _context.Enrollments.Add(enrollment);
                await _context.SaveChangesAsync();

                return Ok("Kayıt başarıyla tamamlandı.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Sunucu hatası: " + ex.Message);
            }
        }


        [HttpGet("is-enrolled")]
        public async Task<IActionResult> IsEnrolled([FromQuery] int courseID)
        {
            // Authorization header'dan token'ı alıyoruz
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            // Token var mı kontrol ediyoruz
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { message = "Token bulunamadı." });
            }

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadToken(token) as JwtSecurityToken;

            // JWT token geçerli mi kontrol ediyoruz
            if (jwtToken == null)
            {
                return Unauthorized(new { message = "Geçersiz token." });
            }

            // Token'dan kullanıcı ID'sini alıyoruz
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Geçersiz kullanıcı." });
            }

            // Kullanıcı ID'sini int olarak parse ediyoruz
            int userId = int.Parse(userIdClaim.Value);

            // Kullanıcı kaydını ve kursu kontrol ediyoruz
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentID == userId && e.CourseID == courseID);

            if (enrollment != null)
                return Ok(true);

            return Ok(false);
        }


        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses([FromQuery] string search)
        {
            var query = _context.Courses.AsQueryable();

            // Arama terimi ile başlık ve açıklamalarda filtreleme yapıyoruz
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Name.Contains(search) || c.Description.Contains(search));
            }

            var courses = await query.ToListAsync();

            return Ok(courses);
        }


        // GET: api/courses?searchTerm=xyz
        [HttpGet("searchCourses")]
        public async Task<IActionResult> GetSearchCourses([FromQuery] string searchTerm)
        {
            // Arama terimi varsa, adı içerisinde arama yapıyoruz
            var coursesQuery = _context.Courses.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                coursesQuery = coursesQuery.Where(c => c.Name.ToLower().Contains(searchTerm.ToLower()));
            }

            // Kursları listeleyip döndürüyoruz
            var courses = await coursesQuery.ToListAsync();

            return Ok(courses);
        }


        [HttpGet("mycourses")]
        public async Task<ActionResult<IEnumerable<Course>>> GetCoursesForStudent()
        {
            // Kullanıcı ID'sini token'dan alıyoruz
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Geçersiz kullanıcı." });
            }

            int userId = int.Parse(userIdClaim.Value); // userID'yi int olarak alıyoruz

            // Enrollment tablosu üzerinden öğrenciye ait kursları çekiyoruz
            var courses = await _context.Enrollments
                .Where(e => e.StudentID == userId)  // Token'dan alınan kullanıcı ID'sine göre filtrele
                .Include(e => e.Course)  // Enrollment ile ilişkili kursları dahil et
                .Select(e => e.Course)   // Sadece kursları seç
                .ToListAsync();

            if (courses == null || !courses.Any())  // Kurs bulunamazsa
            {
                return NotFound("Kayıtlı kurs bulunamadı.");
            }

            return Ok(courses);  // Kursları döndür
        }


        [HttpGet("get/{courseID}")]
        public async Task<IActionResult> GetCourse(int courseID)
        {
            var course = await _context.Courses.FindAsync(courseID);
            if (course == null)
            {
                return NotFound("Kurs bulunamadı.");
            }
            return Ok(course);
        }


    }

}
