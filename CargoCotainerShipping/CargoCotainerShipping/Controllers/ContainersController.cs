using Application.DTOs;
using Application.Services;
using Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;

namespace CargoCotainerShipping.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContainersController : ControllerBase
    {
        private readonly ContainerService _containerService;

        public ContainersController(ContainerService containerService)
        {
            _containerService = containerService;
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableContainers([FromQuery] int portId, [FromQuery] DateOnly availableFrom)
        {
            var containers = await _containerService.GetAvailableContainers(portId, availableFrom);

            if (containers == null || !containers.Any())
                return NotFound("No containers found for the specified port and date.");

            return Ok(containers);
        }

        [HttpGet("admin/containers")]
        public async Task<IActionResult> GetAllContainers()
        {
            var containers = await _containerService.GetAllContainersAdmin();

            if (containers == null || !containers.Any())
                return NotFound("No containers found.");

            return Ok(containers);
        }

       
        [HttpPost]
        [Route("admin/newContainer")]
        public async Task<IActionResult> BookContainer([FromBody] ContainerRequest request)
        {
            try
            {
                var response = await _containerService.NewContainer(

                    request.Type,
                    request.Size,
                    request.CurrentPortId,
                    request.AvailableFrom,
                    request.ShippingCompanyId,
                    request.Capacity
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
