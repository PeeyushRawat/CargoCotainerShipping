using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Core.Entities;

namespace Core.Interfaces
{
    
    public interface IBookingRepository
    {
        Task AddAsync(Booking booking);
        Task<List<Booking>> GetAllBookingsByUserIdAsync(int userId);
        Task<Booking> GetByBookingIdAsync(int id);
        Task<List<Booking>> GetAllBookings();
    }
}
