using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ShippingDbContext _context; // Assuming you have a DbContext for your application

        public UserRepository(ShippingDbContext context)
        {
            _context = context;
        }

        public async Task CreateUser(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<List<User>> GetAllUsers()
        {
            return  await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> GetUserById(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetUserByResetTokenAsync(string resetToken)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.ResetPasswordToken == resetToken && u.ResetPasswordExpire > DateTime.Now);
        }

        public async Task SaveUserAsync(User user, bool validateBeforeSave)
        {
            if (validateBeforeSave)
                _context.Update(user);
            else
                _context.Update(user);
                //_context.UpdateWithoutValidation(user);

            await _context.SaveChangesAsync();
        }

        public async Task<User> UpdateUser(User user)
        {
            _context.Users.UpdateRange(user);
            await  _context.SaveChangesAsync();
            return user;
            
            
        }
    }
}
