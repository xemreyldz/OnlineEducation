using educationPlatformApi.Data;
using educationPlatformApi.Interfaces;
using educationPlatformApi.Models;
using Microsoft.EntityFrameworkCore;

namespace educationPlatformApi.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> ResetPassword(string email, string newPassword)
        {
            var user = await GetUserByEmail(email);
            if (user == null) return false;

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword); // Şifreyi hashle!
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
