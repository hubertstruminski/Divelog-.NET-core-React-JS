using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public interface IMarkerRepository
    {
        void Save(Marker marker);
        void Update(Marker marker);
        void Delete(Marker marker);
        List<Marker> FindAllByUser(Connection user);
        Marker FindByIdAndUser(long markerId, Connection user);
        void DeleteByIdAndUser(long markerId, Connection user);
    }
}
