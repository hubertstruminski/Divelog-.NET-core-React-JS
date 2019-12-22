﻿using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public interface IConnectionRepository
    {
        Connection FindByTwitterUserIdOrEmail(long twitterUserId, string email);
        void Save(Connection connection);
    }
}
