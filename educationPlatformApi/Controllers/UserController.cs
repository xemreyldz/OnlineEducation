using educationPlatformApi.Data;
using educationPlatformApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using educationPlatformApi.Security;
using Microsoft.AspNetCore.Identity;
using System.Net.Mail;
using System.Net;
using educationPlatformApi.Interfaces;




[Route("[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration; // IConfiguration ekleyin
    private readonly ILogger _logger;
    private readonly IEmailService _emailService;
    private readonly IUserService _userService;


    public UserController(ApplicationDbContext context, IConfiguration configuration, ILogger<UserController> logger, IEmailService emailService, IUserService userService)
    {
        _context = context;
        _configuration = configuration; // IConfiguration'ı başlatın
        _logger = logger;
        _emailService = emailService;
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        try
        {
            // Kullanıcı platform kullanım amacına göre alt sınıfa yönlendirilir.
            if (string.IsNullOrEmpty(user.PlatformUsage))
            {
                return BadRequest("Platform kullanım amacı belirtilmelidir.");
            }

            // Kullanıcıyı platformUsage değerine göre yönlendir
            if (user.PlatformUsage == "student")
            {
                // Öğrenci için kayıt işlemi
                var student = new Student
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Phone = user.Phone,
                    Password = BCrypt.Net.BCrypt.HashPassword(user.Password),
                    PlatformUsage = user.PlatformUsage,
                    School = "learnify"

                };

                await _context.Users.AddAsync(student);
            }
            else if (user.PlatformUsage == "instructor")
            {
                // Eğitmen için kayıt işlemi
                var instructor = new Instructor
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Phone = user.Phone,
                    Password = BCrypt.Net.BCrypt.HashPassword(user.Password),
                    PlatformUsage = user.PlatformUsage,
                    ProfileImageUrl = "/profile/default.png",
                    Bio = null
                };

                await _context.Users.AddAsync(instructor);
            }
            else
            {
                return BadRequest("Geçersiz platform kullanım amacı.");
            }

            // Veritabanına kaydet
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kayıt başarılı!" });
        }
        catch (Exception ex)
        {
            // Hata yönetimi
            return StatusCode(500, new { message = "Bir hata oluştu.", details = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] Login login)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == login.Email);

        if (existingUser == null || !BCrypt.Net.BCrypt.Verify(login.Password, existingUser.Password))
        {
            return BadRequest(new { message = "Geçersiz e-posta veya şifre" });
        }

        var token = TokenHandler.CreateToken(_configuration, existingUser);

        return Ok(new
        {
            message = "Oturum Açıldı",
            token = token.AccessToken, // Oluşturulan token
            expiration = token.Expiration, // Token'ın geçerlilik süresi
            userType = existingUser.PlatformUsage,
            userId = existingUser.UserID,
            profileImageUrl = existingUser.ProfileImageUrl
        });
    }


    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest model)
    {
        // Kullanıcının şifresini sıfırlama işlemini yap
        var result = await _userService.ResetPassword(model.Email, model.NewPassword);

        // Sonuç false ise hata mesajı döndür
        if (!result)
        {
            return BadRequest("Kullanıcı bulunamadı veya şifre sıfırlama işlemi başarısız oldu.");
        }

        return Ok("Şifre başarıyla sıfırlandı!");
    }





}

