using Billeteras.Models;
using Billeteras.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _authService.LoginAsync(request.Username, request.Password);

        if (string.IsNullOrEmpty(token))
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        return Ok(new { token });
    }

    [HttpPost("validate-token")]
    public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenRequest request)
    {
        var isValid = await _authService.ValidateTokenAsync(request.Token);

        if (!isValid)
        {
            return Unauthorized(new { message = "Invalid or expired token" });
        }

        return Ok(new { message = "Token is valid" });
    }
}
