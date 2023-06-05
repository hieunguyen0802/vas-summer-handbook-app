using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SummerHandbookApi.Models;

namespace SummerHandbookApi.Data
{
    public partial class SummerHandbookDataContext : DbContext, ISummerHandbookDataContext
    {
        public SummerHandbookDataContext(DbContextOptions<SummerHandbookDataContext> options) : base(options) {
            Database.SetCommandTimeout(6000);
        }

        public DbSet<SummerHandbook> summerHandbook {get; set;}

    }
}