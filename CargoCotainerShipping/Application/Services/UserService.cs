using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class UserService 
    {
        private readonly IUserRepository _userRepository;
        private readonly IEmailNotificationRepository _emailNotificationRepository;

        public UserService(IUserRepository userRepository, IEmailNotificationRepository emailNotificationRepository)
        {
            _userRepository = userRepository;
            _emailNotificationRepository = emailNotificationRepository;
        }

        public async Task<User> RegisterUser(string name, string email, string password, string phoneNo)
        {
            var oldUser = await _userRepository.GetUserByEmail(email);
            if (oldUser == null)
            {
                var user = new User
                {
                    Name = name,
                    Email = email,
                    Password = password,
                    Phone = phoneNo
                };

                user.HashPassword(); // Hash the password before saving
                await _userRepository.CreateUser(user);
                return user;
            }
            else
            {

                throw new Exception("User is already exists, try with new Email");
            }
        }
        public async Task<User> LoginUser(string email, string password)
        {
            var user = await _userRepository.GetUserByEmail(email);

            if (user == null || !user.VerifyPassword(password))
            {
                throw new UnauthorizedAccessException("Invalid Email or Password");
            }

            return user;
        }

        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _userRepository.GetUserByEmail(email);

            if (user == null)
                throw new Exception("User not found with this email");

            // Generate reset password token
            var resetToken = user.GenerateResetPasswordToken();

            // Save token without validation
            await _userRepository.SaveUserAsync(user, false);

            // Build the reset URL (front-end can have this as a page)
            var domainName = "localhost:3002";
            var resetUrl = $"http://{domainName}/password/reset/{resetToken}";

            var message = $"Your password reset token is as follows:\n\n{resetUrl}\n\nIf you have not requested this email, then ignore it.";

            try
            {
                // Send email
                _emailNotificationRepository.SendMailNotification(user.Email, "Password Recovery", message);
            }
            catch (Exception ex)
            {
                // Remove reset tokens if email sending fails
                user.ResetPasswordToken = null;
                user.ResetPasswordExpire = null;

                await _userRepository.SaveUserAsync(user, false);
                throw new Exception("Error sending email: " + ex.Message);
            }
        }

        public async Task ResetPasswordAsync(string token, string newPassword, string confirmPassword)
        {
            if (newPassword != confirmPassword)
                throw new Exception("Password does not match");

            var resetPasswordToken = HashToken(token);

            var user = await _userRepository.GetUserByResetTokenAsync(resetPasswordToken);

            if (user == null || user.ResetPasswordExpire < DateTime.Now)
                throw new Exception("Password reset token is invalid or has expired");

            // Set new password and remove the reset token
            user.Password = newPassword;
            user.HashPassword();
            user.ResetPasswordToken = null;
            user.ResetPasswordExpire = null;

            await _userRepository.SaveUserAsync(user, true);
        }

        //User updates

        public async Task<User> UpdateUser(int userId, string name, string email, string phoneNo)
        {
            var validUser = await _userRepository.GetUserById(userId);

            if (!string.IsNullOrEmpty(name))
            {
                // Update Name if provided
                validUser.Name = name;
            }

            if (!string.IsNullOrEmpty(email))
            {
                // Update Email if provided
                validUser.Email = email;
            }

            if (!string.IsNullOrEmpty(phoneNo))
            {
                // Update Phone Number if provided
                validUser.Phone = phoneNo;
            }

            // Save the updated user details back to the repository
            await _userRepository.UpdateUser(validUser);

            // Return the updated user object
            return validUser;
        }

        public async Task<List<User>> GetAllUsers()
        {
            var result = await _userRepository.GetAllUsers();
            return result;
        }
        private string HashToken(string token)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }
}
