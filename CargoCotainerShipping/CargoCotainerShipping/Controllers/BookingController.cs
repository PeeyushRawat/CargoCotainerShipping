using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Core.Entities;
using Application.DTOs;
using Application.Services;
using System.Formats.Asn1;

namespace CargoCotainerShipping.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        [Route("book")]
        public async Task<IActionResult> BookContainer([FromBody] BookingRequest request)
        {
            try
            {
                var response = await _bookingService.BookContainerAsync(
                    request.UserId, request.ContainerId, request.SourcePortId, request.DestinationPortId, request.ShippingDate);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetBookingDetails/{userId:int}")]
        public async Task<IActionResult> GetBookingDetailsById(int userId)
        {
            var response = await _bookingService.GetBookingDetailsByUserId(userId);
            return Ok(response);
        }


        [HttpGet("GetDetailsByBookingId/{bookingId:int}")]
        public async Task<IActionResult>GetBookingDetailsByBookingId(int bookingId)
        {
            var respopnse = await _bookingService.GetBookingDetailsByBookingId(bookingId);
            return Ok(respopnse);
        }

        [HttpGet("price")]
        public async Task<IActionResult> GetBookingPrice([FromQuery] int containerId, [FromQuery] int destinationPortId)
        {
            try
            {
                var price = await _bookingService.CalculateBookingPrice(containerId, destinationPortId);
                return Ok(new { price });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GetAllBookings")]
        public async Task<ActionResult<List<BookingDetailsResponse>>> GetAllBookings()
        {
            try
            {
                var bookingDetails = await _bookingService.GetAllBookingsAsync();
                return Ok(bookingDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
