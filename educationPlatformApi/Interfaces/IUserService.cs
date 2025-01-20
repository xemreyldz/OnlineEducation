using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using educationPlatformApi.Models;

namespace educationPlatformApi.Interfaces
{
    public interface IUserService
    {
        Task<User> GetUserByEmail(string email);
        Task<bool> ResetPassword(string email, string newPassword);
    }
}