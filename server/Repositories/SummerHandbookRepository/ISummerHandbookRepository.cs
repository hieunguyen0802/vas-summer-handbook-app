using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SummerHandbookApi.Models;

namespace SummerHandbookApi.Repositories.SummerHandbookRepository
{
    public interface ISummerHandbookRepository
    {
        Task<List<SummerHandbook>> validParent(string email);
        Task<List<Student>> validOtpCode (string OtpCode);
        Task insertParent(Parent model);
        Task<bool> UpdateParent(Parent form);
        Task<Parent> getParentInfoByEmail(string email);
        Task<Parent> getParentInfoById(int parentId);
        Task<Parent> validOtpFromParent(string OtpCode);
        Task<List<Parent>> getAllParent();
        Task insertStudent(Student model);
        Task<bool> updateStudent(Student form);
        Task<Student> getStudentInfoById(int parentId);
        Task<List<Student>> getAllStudent();
        
    }
}