using Core.Entities;
using Application.DTOs;
using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Application.Services;

namespace CargoCotainerShipping.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;

        public AuthController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = await _userService.RegisterUser(request.Name, request.Email, request.Password, request.PhoneNo);
            if (user != null)
            {
                return SendTokenResponse(user, 200);
            }
            else
            {
                return StatusCode(500);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userService.LoginUser(request.Email, request.Password);
            return SendTokenResponse(user, 200);
        }

        [HttpPost("forgot")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                await _userService.ForgotPasswordAsync(request.Email);
                return Ok(new { success = true, message = $"Email sent to: {request.Email}" });
            }
            //catch (NotFoundException ex)
            //{
            //    return NotFound(new { message = ex.Message });
            //}
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("reset/{token}")]
        public async Task<IActionResult> ResetPassword(string token, [FromBody] ResetPasswordRequest request)
        {
            try
            {
                await _userService.ResetPasswordAsync(token, request.NewPassword, request.ConfirmPassword);
                return Ok(new { success = true, message = "Password has been reset" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private IActionResult SendTokenResponse(User user, int statusCode)
        {
            string token = user.GenerateJwtToken("your_jwt_secretahfghfsgdhjgshhfjkshfjkhjkfhsjkdhgjsdhgjkshdjkfghsjhfjs", 24);

            var options = new CookieOptions
            {
                Expires = DateTime.Now.AddDays(7), // Set your desired expiration
                HttpOnly = true
            };

            Response.Cookies.Append("token", token, options);

            return Ok(new
            {
                success = true,
                token,
                user
            });
        }

        //userchanges
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest userRequest)
        {
            try
            {
                var result = await _userService.UpdateUser(userRequest.Id, userRequest.Name, userRequest.Email, userRequest.PhoneNo);
                if (result != null)
                    return Ok(result);
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var result = await _userService.GetAllUsers();
                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
    
}
