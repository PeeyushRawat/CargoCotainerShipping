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
    
    public class BookingRepository : IBookingRepository
    {
        private readonly ShippingDbContext _dbContext;

        public BookingRepository(ShippingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddAsync(Booking booking)
        {
            _dbContext.Bookings.Add(booking);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Booking>> GetAllBookingsByUserIdAsync(int userId)
        {
            return await _dbContext.Bookings.Where(x => x.UserId == userId)
                .Include(x => x.User)
                .Include(x => x.Container)
                .Include(x => x.SourcePort)
                .Include(x => x.DestinationPort)
                .ToListAsync();
        }

        public async Task<Booking> GetByBookingIdAsync(int id)
        {
            return await _dbContext.Bookings
                    .Where(x => x.BookingId == id)
                    .Include(x => x.User)
                    .Include(x => x.Container)
                        .ThenInclude(c => c.ShippingCompany)  
                    .Include(x => x.SourcePort)
                    .Include(x => x.DestinationPort)
                    .SingleAsync();
        }
        public async Task<List<Booking>> GetAllBookings()
        {
            return await _dbContext.Bookings
                .Include(b => b.User)
                .Include(b => b.Container)
                .Include(b => b.SourcePort)
                .Include(b => b.DestinationPort).ToListAsync();


        }
    }
}
