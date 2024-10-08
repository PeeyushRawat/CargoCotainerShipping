﻿using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IPortRepository
    {
        Task<Port> GetPortLocationById(int id);
        Task<List<Port>> GetListOfPorts();        
    }
}
