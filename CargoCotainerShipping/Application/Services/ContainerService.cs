using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ContainerService
    {
        private readonly IContainerRepository _containerRepository;

        public ContainerService(IContainerRepository containerRepository)
        {
            _containerRepository = containerRepository;
        }

        public async Task<List<Container>> GetAvailableContainers(int portId, DateOnly availableFrom)
        {
            return await _containerRepository.GetAvailableContainersByPortAndDateAsync(portId, availableFrom);
        }
        public async Task<List<Container>> GetAllContainersAdmin()
        {
            return await _containerRepository.GetAllContainers();
        }
        public async Task<Container> NewContainer(
            string type,
            int size,
            int currentPortId,
            DateOnly availableFrom,
            int shippingCompanyId,
            double capacity
        )
        {
            Container container = new Container();
            container.Type = type;
            container.Size = size;
            container.Capacity = capacity;
            container.CurrentPortId = currentPortId;
            container.AvailableFrom = availableFrom;
            container.ShippingCompanyId = shippingCompanyId;

            return await _containerRepository.AddAsync(container);
        }
    }
}