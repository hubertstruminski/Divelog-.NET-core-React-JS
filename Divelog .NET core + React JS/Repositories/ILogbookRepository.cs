using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public interface ILogbookRepository
    {
        void Save(Logbook logbook);
        void Update(Logbook logbook);
        void Delete(Logbook logbook);
        Logbook FindByMarker(Marker marker);
        List<Logbook> FindAllByUser(Connection user);
        Logbook FindByIdAndUser(long logbookId, Connection user);
    }
}
