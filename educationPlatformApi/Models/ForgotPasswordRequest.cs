using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace educationPlatformApi.Models
{
    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
    }
}