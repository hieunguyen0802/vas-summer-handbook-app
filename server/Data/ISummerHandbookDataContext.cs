
using Microsoft.EntityFrameworkCore;
using SummerHandbookApi.Models;

namespace SummerHandbookApi.Data
{
    public interface ISummerHandbookDataContext
    {
        DbSet<SummerHandbook> summerHandbook {get; set;}
        DbSet<Parent> Parent {get; set;}
        DbSet<Student> Student {get; set;}
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken));
    }
}