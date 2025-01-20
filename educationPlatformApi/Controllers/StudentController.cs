using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using educationPlatformApi.Data;
using educationPlatformApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace educationPlatformApi.Controllers
{
    [Route("[controller]")]
    public class StudentController : Controller
    {
        private readonly ILogger<StudentController> _logger;
        private readonly ApplicationDbContext _context;
         private readonly IWebHostEnvironment _env;
          private readonly IConfiguration _configuration;

        public StudentController(ILogger<StudentController> logger, ApplicationDbContext context, IWebHostEnvironment env, IConfiguration configuration)
        {
            _logger = logger;
            _context = context;
            _env = env;
            _configuration = configuration;
        }

         [HttpGet("profile")]
        public async Task<ActionResult<User>> GetUserProfile()
        {

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)); // JWT token'dan userId alınır

            // User ve Instructor tablosunda sorgulama yapabilmek için, her ikisinin de birleşik olduğu yerden çekim yapılmalı.
            var user = await _context.Users
                .OfType<Student>()  // Sadece Student tipindeki kullanıcıları alıyoruz
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
                user.School
                
            });
        }

         [HttpPut("update")]
        public async Task<ActionResult> UpdateUser([FromForm] UpdateStudentRequest request, [FromForm] IFormFile? file)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));  // JWT token'dan userId alınır

            // Mevcut kullanıcıyı bul
            var user = await _context.Users
                .OfType<Student>()  // Instructor tipindeki kullanıcıları al
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
            user.School = request.School;
            user.Phone = request.Phone;

            try
            {
                // Değişiklikleri veritabanına kaydet
                await _context.SaveChangesAsync();

                var newToken = educationPlatformApi.Security.TokenHandler.CreateToken(_configuration, user);

                return Ok(new { message = "Profil başarıyla güncellendi.",token = newToken.AccessToken });
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama yap
                _logger.LogError(ex, "Güncelleme sırasında bir hata oluştu.");
                return StatusCode(500, new { message = "Profil güncellenirken bir hata oluştu." });
            }
        }

        

       
    }
}