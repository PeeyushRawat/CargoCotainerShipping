using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IUserRepository
    {
        Task CreateUser(User user);
        Task<User> GetUserByEmail(string email);
        Task<User> GetUserById(int id);
        Task<User?> GetUserByResetTokenAsync(string resetToken);
        Task SaveUserAsync(User user, bool validateBeforeSave);
        Task<User> UpdateUser(User user);
        Task<List<User>> GetAllUsers();
    }
}
