﻿using Divelog_.NET_core___React_JS.Context;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public class CustomTwitterRepository : ICustomTwitterRepository
    {
        private DivelogContext _context;

        public CustomTwitterRepository(DivelogContext context)
        {
            _context = context;
        }

        public void Save(CustomTwitter customTwitter)
        {
            _context.CustomTwitters.Add(customTwitter);
            _context.SaveChanges();
        }
    }
}