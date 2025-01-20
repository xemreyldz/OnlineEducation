using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using educationPlatformApi.Models;
using Microsoft.IdentityModel.Tokens;


namespace educationPlatformApi.Security
{
    public static class TokenHandler
    {
        public static Token CreateToken(IConfiguration configuration, User user)
        {
            Token token = new();
            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Token:SecurityKey"]));

            SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            token.Expiration = DateTime.Now.AddMinutes(Convert.ToInt16(configuration["Token:Expiration"]));

            var claims = new List<Claim> {
                new Claim(ClaimTypes.Name, user.FirstName), // kullanıcı adı
                new Claim(ClaimTypes.Surname, user.LastName),  // kullanıcı soyadı
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()), // Kullanıcı kimliği (ID) ekleniyor
                new Claim("userTypes",user.PlatformUsage),
                new Claim("profileImageUrl", user.ProfileImageUrl ?? string.Empty) // Profil resmi URL'si
            };



            JwtSecurityToken jwtSecurityToken = new(
                issuer: configuration["Token:Issuer"],
                audience: configuration["Token:Audience"],
                expires: token.Expiration,
                notBefore: DateTime.Now,
                signingCredentials: credentials,
                claims: claims
            );

            JwtSecurityTokenHandler tokenHandler = new();
            token.AccessToken = tokenHandler.WriteToken(jwtSecurityToken);

            return token;
        }
    }
}
