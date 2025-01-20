using System;
using System.Linq;
using System.Threading.Tasks;
using educationPlatformApi.Models;  // User modelini kullandığınız yer
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using educationPlatformApi.Data;

namespace educationPlatformApi.Controllers
{
    [Authorize]  // JWT ile doğrulama yapılmasını sağlıyor
    [ApiController]
    [Route("[controller]")]  // API route'u "/api/instructor" olacak
    public class InstructorController : ControllerBase
    {
        private readonly ILogger<InstructorController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _configuration;

        // Constructor'da DbContext'i enjekte ediyoruz
        public InstructorController(ILogger<InstructorController> logger, ApplicationDbContext context, IWebHostEnvironment env, IConfiguration configuration)
        {
            _logger = logger;
            _context = context;  // ApplicationDbContext'i burada alıyoruz
            _env = env;
            _configuration = configuration;
        }

        // Kullanıcı bilgilerini döndüren örnek bir metod


        [HttpGet("profile")]
        public async Task<ActionResult<User>> GetUserProfile()
        {

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)); // JWT token'dan userId alınır

            // User ve Instructor tablosunda sorgulama yapabilmek için, her ikisinin de birleşik olduğu yerden çekim yapılmalı.
            var user = await _context.Users
                .OfType<Instructor>()  // Sadece Instructor tipindeki kullanıcıları alıyoruz
                .FirstOrDefaultAsync(u => u.UserID == userId);

            if (user == null)
            {
                return NotFound();
            }
            var profileImageUrl = string.IsNullOrEmpty(user.ProfileImageUrl)
       ? null
       : $"http://localhost:5212{user.ProfileImageUrl}";  // Tam URL oluşturuyoruz

            return Ok(new
            {
                user.FirstName,
                user.LastName,
                user.Age,
                user.Email,
                user.Phone,
                ProfileImageUrl = profileImageUrl,
                user.Specialty,  // Instructor'a özel alan
                user.Bio,        // Instructor'a özel alan
            });
        }
        [HttpPut("update")]
        public async Task<ActionResult> UpdateUser([FromForm] UpdateInstructorRequest request, [FromForm] IFormFile? file)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));  // JWT token'dan userId alınır

            // Mevcut kullanıcıyı bul
            var user = await _context.Users
                .OfType<Instructor>()  // Instructor tipindeki kullanıcıları al
                .FirstOrDefaultAsync(u => u.UserID == userId);

            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            // Profil resmi değişmişse ve dosya gönderilmişse
            if (file != null && file.Length > 0)
            {
                // Yalnızca belirli dosya uzantılarına izin verilir
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(file.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                    return BadRequest("Yalnızca .jpg, .jpeg, .png ve .gif dosya türleri desteklenmektedir.");

                // Dosya boyutu 2 MB'den fazla olmamalıdır
                if (file.Length > 2 * 1024 * 1024)
                    return BadRequest("Dosya boyutu maksimum 2 MB olmalıdır.");

                // Sunucudaki yükleme dizinini oluşturma
                var uploadPath = Path.Combine(_env.WebRootPath, "profile");
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

                // Kullanıcının profil resmi URL'sini güncelle
                user.ProfileImageUrl = $"/profile/{uniqueFileName}";
            }

            // Kullanıcı bilgilerini güncelle (telefon numarası, ad, soyad vb.)
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;
            user.Age = request.Age;
            user.Specialty = request.Specialty;
            user.Bio = request.Bio;
            user.Phone = request.Phone;

            try
            {
                // Değişiklikleri veritabanına kaydet
                await _context.SaveChangesAsync();

                var newToken = educationPlatformApi.Security.TokenHandler.CreateToken(_configuration, user);




                return Ok(new { message = "Profil başarıyla güncellendi.", token = newToken.AccessToken });
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama yap
                _logger.LogError(ex, "Güncelleme sırasında bir hata oluştu.");
                return StatusCode(500, new { message = "Profil güncellenirken bir hata oluştu." });
            }
        }





















        [HttpGet("stats")]
        public async Task<IActionResult> GetInstructorStats()
        {
            var instructorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var stats = await _context.Courses
                .Where(c => c.InstructorID == instructorId)
                .GroupBy(c => c.InstructorID)
                .Select(g => new
                {
                    TotalCourses = g.Count(),
                    TotalStudents = g.SelectMany(c => c.Enrollments)
                        .Where(e => e.IsActive)
                        .Select(e => e.StudentID)
                        .Distinct()
                        .Count()
                })
                .FirstOrDefaultAsync();

            if (stats == null)
            {
                return NotFound("Eğitmen bulunamadı veya kursları yok.");
            }

            return Ok(stats);
        }

        [HttpGet("mystudents")]
        public async Task<IActionResult> GetInstructorStudents()
        {
            try
            {
                // 1. Instructor ID'yi JWT token'dan al
                var instructorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                // 2. Kursları ve öğrencileri ilişkilendir
                var students = await _context.Courses
                    .Where(c => c.InstructorID == instructorId) // Eğitmenin kurslarını al
                    .SelectMany(c => c.Enrollments)  // Her kurs için enrollments (kayıtlar) alınır
                    .Where(e => e.IsActive)  // Sadece aktif kayıtları al
                    .Select(e => new
                    {
                        e.StudentID,
                        e.Student.FirstName,  // Öğrenci adı
                        e.Student.LastName,    // Öğrenci soyadı
                        CourseName = e.Course.Name,
                        e.EnrollmentDate // EnrollmentDate'i alıyoruz
                    })
                    .Distinct()
                    .ToListAsync();

                return Ok(students);  // Öğrenci verisini döndür
            }
            catch (Exception ex)
            {
                // Hata mesajı döndür
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //Bildirimleri al
        [HttpGet("getnotifications")]
        public async Task<IActionResult> GetInstructorNotifications()
        {
            var instructorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var notifications = await _context.Notifications
                .Where(n => n.InstructorID == instructorId)
                .ToListAsync();
            return Ok(notifications);
        }

        // Bildirim gönder
        [HttpPost("send")]
        public async Task<IActionResult> SendNotification(NotificationRequest notificationdto)
        {
            var instructorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var notification = new Notification
            {
                Message = notificationdto.Message,
                CreatedAt = DateTime.UtcNow,
                InstructorID = instructorId
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Bildirim başarıyla gönderildi." });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateNotification(int id, [FromBody] NotificationRequest notificationDto)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            notification.Message = notificationDto.Message;
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                return NotFound();  // Geçersiz ID hatası
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return NoContent();  // Silme işlemi başarıyla tamamlandı
        }

        [HttpGet("allnotifications")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications()
        {
            // Veritabanından tüm bildirimleri çekiyoruz
            var notifications = await _context.Notifications
                .OrderByDescending(n => n.CreatedAt) // En yeni bildirimleri önce alalım
                .ToListAsync();

            return Ok(notifications); // Bildirimleri JSON olarak geri döndürüyoruz
        }

        [HttpPost("updateNotificationStatus")]
        public async Task<IActionResult> UpdateNotificationStatus([FromBody] NotificationStatusUpdate model)
        {
            var notification = await _context.Notifications.FindAsync(model.NotificationID);
            if (notification == null) return NotFound("Bildirim bulunamadı.");

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok("Bildirim başarıyla güncellendi.");
        }




    }
}
