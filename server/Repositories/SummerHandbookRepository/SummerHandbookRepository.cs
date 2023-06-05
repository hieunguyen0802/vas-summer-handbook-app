
using Microsoft.EntityFrameworkCore;
using SummerHandbookApi.Data;
using SummerHandbookApi.Models;

namespace SummerHandbookApi.Repositories.SummerHandbookRepository
{
    public class SummerHandbookRepository : ISummerHandbookRepository
    {
        private readonly ISummerHandbookDataContext _SummerHandbookDbContext;
        public SummerHandbookRepository(ISummerHandbookDataContext summerHandbookDataContext)
        {
            _SummerHandbookDbContext = summerHandbookDataContext;
        }

        public async Task<List<SummerHandbook>> validParent(string email)
        {
            if (email.Contains("@"))
            {
                return await _SummerHandbookDbContext.summerHandbook.FromSql($"getForm @email = {email}").ToListAsync();
            }
            else
            {
                return await _SummerHandbookDbContext.summerHandbook.FromSql($"getFormbyPhoneNo @email = {email}").ToListAsync();
            }
        }
        

        public async Task insertParentCode(SummerHandbook model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model));
            _SummerHandbookDbContext.summerHandbook.Add(model);
            await _SummerHandbookDbContext.SaveChangesAsync();
        }

        public async Task<SummerHandbook> validOtpCode (string OtpCode) {
            var student = await _SummerHandbookDbContext.summerHandbook.Where(c => c.verify_code == OtpCode).FirstOrDefaultAsync();
            return student;
        }

        public async Task<SummerHandbook> getParentInfo(string email){
            var parent = await _SummerHandbookDbContext.summerHandbook.Where(c => c.emailFromParent == email).FirstOrDefaultAsync();
            return parent;
        }

        public async Task<bool> UpdateSummerHandbook(SummerHandbook form){
            if (form == null)
                return false;
            _SummerHandbookDbContext.summerHandbook.Update(form);
            await _SummerHandbookDbContext.SaveChangesAsync();
            return true;
        }



    }
}