
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
            return await _SummerHandbookDbContext.summerHandbook.FromSql($"getForm @email = {email}").ToListAsync();
        }

        public async Task<List<Student>> validOtpCode(string OtpCode)
        {
            var parent = await _SummerHandbookDbContext.Parent.Where(c => c.verify_code == OtpCode).FirstOrDefaultAsync();
            var student = await _SummerHandbookDbContext.Student.Where(c => c.parentId == parent.Id).ToListAsync();
            return student;
        }
        public async Task<Parent> validOtpFromParent(string OtpCode){
            return await _SummerHandbookDbContext.Parent.Where(c => c.verify_code == OtpCode).FirstOrDefaultAsync();
        }
        public async Task insertParent(Parent model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model));
            _SummerHandbookDbContext.Parent.Add(model);
            await _SummerHandbookDbContext.SaveChangesAsync();
        }


        public async Task<Parent> getParentInfoByEmail(string email)
        {
            var parent = await _SummerHandbookDbContext.Parent.Where(c => c.emailFromParent == email).FirstOrDefaultAsync();
            return parent;
        }

         public async Task<Parent> getParentInfoById(int parentId)
        {
            var parent = await _SummerHandbookDbContext.Parent.Where(c => c.Id == parentId).FirstOrDefaultAsync();
            return parent;
        }

        public async Task<bool> UpdateParent(Parent form)
        {
            if (form == null)
                return false;
            _SummerHandbookDbContext.Parent.Update(form);
            await _SummerHandbookDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Parent>> getAllParent()
        {
            return await _SummerHandbookDbContext.Parent.AsQueryable().ToListAsync();
        }

        //Student

        public async Task insertStudent(Student model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model));
            _SummerHandbookDbContext.Student.Add(model);
            await _SummerHandbookDbContext.SaveChangesAsync();
        }
         public async Task<Student> getStudentInfoById(int studentId)
        {
            var parent = await _SummerHandbookDbContext.Student.Where(c => c.Id == studentId).FirstOrDefaultAsync();
            return parent;
        }

        public async Task<bool> updateStudent(Student form)
        {
            if (form == null)
                return false;
            _SummerHandbookDbContext.Student.Update(form);
            await _SummerHandbookDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Student>> getAllStudent()
        {
            return await _SummerHandbookDbContext.Student.AsQueryable().ToListAsync();
        }



    }
}