
using Microsoft.EntityFrameworkCore;
using SummerHandbookApi.Models;

namespace SummerHandbookApi.Data
{
    public interface ISummerHandbookDataContext
    {
        DbSet<SummerHandbook> summerHandbook {get; set;}
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken));
    }
}