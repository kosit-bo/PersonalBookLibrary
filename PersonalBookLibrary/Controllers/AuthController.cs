using Microsoft.AspNetCore.Mvc;
using PersonalBookLibrary.Data;

namespace PersonalBookLibrary.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Username == request.Username);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid username or password"
                });
            }

            bool validPassword = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash
            );

            if (!validPassword)
            {
                return Unauthorized(new
                {
                    message = "Invalid username or password"
                });
            }

            return Ok(new
            {
                message = "Login successful",
                userId = user.Id
            });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}