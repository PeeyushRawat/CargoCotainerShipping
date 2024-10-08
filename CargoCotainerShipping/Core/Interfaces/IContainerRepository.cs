using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IContainerRepository
    {
        Task<List<Container>> GetAvailableContainersByPortAndDateAsync(int portId, DateOnly availableFrom);
        Task<List<Container>> GetAllContainers();
        Task<Container> AddAsync(Container container);
        Task<Container> GetByIdAsync(int id);
        Task UpdateAsync(Container container);
    }
}
