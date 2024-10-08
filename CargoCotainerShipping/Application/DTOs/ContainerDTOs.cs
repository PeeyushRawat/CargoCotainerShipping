using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class ContainerRequest
    {
        public string Type { get; set; }
        public int Size { get; set; }                   // Size in feet (20ft, 40ft, etc.)
        public int CurrentPortId { get; set; }          // Foreign key for Port
        public DateOnly AvailableFrom { get; set; }    // Optional availability date
        public int ShippingCompanyId { get; set; }      // Foreign key for ShippingCompany
        public double Capacity { get; set; }            // Container capacity in tons
    }
    public class ContainerResponse
    {

    }
}
