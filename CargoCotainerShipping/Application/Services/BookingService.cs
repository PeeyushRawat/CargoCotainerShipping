using Core.Entities;
using Core.Interfaces;
using Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{        
    public class BookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IContainerRepository _containerRepository;
        private readonly IEmailNotificationRepository _emailNotificationRepository;
        private readonly IUserRepository _userRepository;
        
        // Future Task : make it dynamic with new ports added in a location.
        public List<List<int>> DISTANCE_GRAPH = new List<List<int>>
        {
            new List<int>() { 0 , 1 , 5 , 5 , 7 , 7 , 3 , 2 , 3 , 6 },
            new List<int>() { 1 , 0 , 5 , 5 , 7 , 7 , 3 , 2 , 3 , 6 },
            new List<int>() { 5 , 5 , 0 , 1 , 6 , 6 , 4 , 6 , 7 , 3 },
            new List<int>() { 5 , 5 , 1 , 0 , 6 , 6 , 4 , 6 , 7 , 3 },
            new List<int>() { 7 , 7 , 6 , 6 , 0 , 1 , 8 , 9 , 10 , 5 },
            new List<int>() { 7 , 7 , 6 , 6 , 1 , 0 , 8 , 9 , 10 , 5 },
            new List<int>() { 3 , 3 , 4 , 4 , 8 , 8 , 0 , 4 , 5 , 6 },
            new List<int>() { 2 , 2 , 6 , 6 , 9 , 9 , 4 , 0 , 1 , 7 },
            new List<int>() { 3 , 3 , 7 , 7 , 10 , 10 , 5 , 1 , 0 , 8 },
            new List<int>() { 6 , 6 , 3 , 3 , 5 , 5 , 6 , 7 , 8 , 0 }
        };

        public BookingService(
            IBookingRepository bookingRepository,
            IContainerRepository containerRepository,
            IEmailNotificationRepository emailNotificationRepository,
            IUserRepository userRepository
        )
        {
            _bookingRepository = bookingRepository;
            _containerRepository = containerRepository;
            _emailNotificationRepository = emailNotificationRepository;
            _userRepository = userRepository;
        }

        public async Task<BookingResponse> BookContainerAsync(int userId, int containerId, int sourcePortId, int destinationPortId, DateOnly shippingDate)
        {
            // Check if the container, user, and ports exist
            var container = await _containerRepository.GetByIdAsync(containerId);
            if (container == null) throw new Exception("Container not found.");

            if(shippingDate < DateOnly.FromDateTime(DateTime.Now))
            {
                throw new Exception("Your date sholud not less Than Today's Date");
            }

            if (sourcePortId == destinationPortId)
            {
                throw new Exception("Your source port and destination port should be different");
            }

            //var user = await _userRepository.GetByIdAsync(userId);
            //if (user == null) throw new Exception("User not found.");

            //var sourcePort = await _portRepository.GetByIdAsync(sourcePortId);
            //if (sourcePort == null) throw new Exception("Source Port not found.");

            //var destinationPort = await _portRepository.GetByIdAsync(destinationPortId);
            //if (destinationPort == null) throw new Exception("Destination Port not found.");


            DateOnly deliveryDate = shippingDate.AddDays(CalculateNoOfDaysToReach(sourcePortId, destinationPortId));

            // Create a new Booking
            var booking = new Booking
            {
                UserId = userId,
                ContainerId = containerId,
                SourcePortId = sourcePortId,
                DestinationPortId = destinationPortId,
                Created = DateTime.Now,
                DeliveryDate = deliveryDate
            };

            // Save booking to the repository
            await _bookingRepository.AddAsync(booking);

            // Update container's current port and available date
            container.CurrentPortId = destinationPortId;
            container.AvailableFrom = deliveryDate;

            await _containerRepository.UpdateAsync(container);

            var user = await _userRepository.GetUserById(userId);

            if (user.Email == null)
            {
                throw new Exception("Email sholud not be null");
            }



            string emailBody = await _emailNotificationRepository.GenerateEmailBodyAsync(user, booking);

            _emailNotificationRepository.SendMailNotification(user.Email, "Booking Confirmation", emailBody);


            return new BookingResponse
            {
                BookingId = booking.BookingId,
                Message = "Container booked successfully."
            };
        }

        public int CalculateNoOfDaysToReach(int sourcePortId, int destinationPortId)
        {
            return DISTANCE_GRAPH[sourcePortId - 1][destinationPortId - 1];
        }

        public async Task<List<BookingDetailsResponse>> GetBookingDetailsByUserId(int userId)
        {
           
            try
            {
                var listOfBookings = await _bookingRepository.GetAllBookingsByUserIdAsync(userId);

                // Map the list of bookings to BookingResponseDetails
                var bookingDetailsList = new List<BookingDetailsResponse>();

                foreach (var book in listOfBookings)
                {
                    var deliveryDays = CalculateNoOfDaysToReach((int)book.SourcePortId, (int)book.DestinationPortId);

                    // Calculate the starting date by subtracting delivery days from the delivery date
                    var startingDate = book.DeliveryDate.AddDays(-deliveryDays);

                    // Create the booking detail object using DateOnly
                    var bookingDetail = new BookingDetailsResponse
                    {
                        BookingId = book.BookingId,
                        UserName = book.User.Name,
                        ContainerType = book.Container.Type,
                        ContainerSize = book.Container.Size,
                        SourceportLocation = book.SourcePort.Name,
                        DestinationportLocation = book.DestinationPort.Name,
                        BookingDate = DateOnly.FromDateTime(book.Created),
                        DeliveryDate = book.DeliveryDate, 
                        OutOfDelivery = startingDate
                    };

                    bookingDetailsList.Add(bookingDetail);
                }

                return bookingDetailsList;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while retrieving booking details.", ex);
            }
        }

        public async Task<BookingDetailsResponse> GetBookingDetailsByBookingId(int bookingId)
        {
            try
            {


                var response = await _bookingRepository.GetByBookingIdAsync(bookingId);

                var booking = new Booking();
                var deliveryDays = CalculateNoOfDaysToReach((int)response.SourcePortId, (int)response.DestinationPortId);

                // Calculate the starting date by subtracting delivery days from the delivery date
                var startingDate = response.DeliveryDate.AddDays(-deliveryDays);

                // Create the booking detail object using DateOnly
                var bookingDetail = new BookingDetailsResponse
                {
                    BookingId = response.BookingId,
                    UserId = (int)response.UserId,
                    UserName = response.User.Name,
                    ContainerType = response.Container.Type,
                    ContainerSize = response.Container.Size,
                    SourceportLocation = response.SourcePort.Location,
                    DestinationportLocation = response.DestinationPort.Location,
                    BookingDate = DateOnly.FromDateTime(response.Created),
                    DeliveryDate = response.DeliveryDate,
                    OutOfDelivery = startingDate
                };

                return bookingDetail;

            }
            catch (Exception ex)
            {
                throw new Exception("Error at getting boooking details");
            }
            
        }

        public async Task<double> CalculateBookingPrice(int containerId, int destinationId)
        {
            // Fetch the booking along with the related container and shipping company
            var container = await _containerRepository.GetByIdAsync(containerId);

            if (container == null || container.ShippingCompany == null )
            {
                throw new Exception("Invalid booking or related data is missing.");
            }

            // Get container size and shipping company rate per day
            int containerSize = container.Size;  // For example, 20ft, 40ft
            double rate = container.ShippingCompany.RatePerDayPer10ftCont;

            // Calculate the number of days for the booking
            var bookingDuration = CalculateNoOfDaysToReach(container.CurrentPortId,destinationId);

            // Calculate the price based on size and rate
            double price = containerSize * rate * bookingDuration ;

            return price;
        }
        public async Task<List<BookingDetailsResponse>> GetAllBookingsAsync()
        {
            // Here you can add any business logic if needed

            try
            {
                // Fetch all bookings from the repository
                var bookings = await _bookingRepository.GetAllBookings();

                // Convert to detailed response
                var bookingDetailsResponses = new List<BookingDetailsResponse>();

                foreach (var booking in bookings)
                {
                    var deliveryDays = CalculateNoOfDaysToReach((int)booking.SourcePortId, (int)booking.DestinationPortId);

                    // Calculate the starting date by subtracting delivery days from the delivery date
                    var startingDate = booking.DeliveryDate.AddDays(-deliveryDays);

                    // Create the booking detail object
                    var bookingDetail = new BookingDetailsResponse
                    {
                        BookingId = booking.BookingId,
                        UserId = (int)booking.UserId,
                        UserName = booking.User.Name,
                        ContainerType = booking.Container.Type,
                        ContainerSize = booking.Container.Size,
                        SourceportLocation = booking.SourcePort.Location,
                        DestinationportLocation = booking.DestinationPort.Location,
                        BookingDate = DateOnly.FromDateTime(booking.Created),
                        DeliveryDate = booking.DeliveryDate,
                        OutOfDelivery = startingDate
                    };

                    bookingDetailsResponses.Add(bookingDetail);
                }

                return bookingDetailsResponses;
            }
            catch (Exception ex)
            {
                // Log the exception (not shown here for brevity)
                throw new Exception("Error at getting all bookings: " + ex.Message);
            }
        }

    }

}



