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
        Task<SummerHandbook> getParentInfo(string email);
        Task insertParentCode(SummerHandbook model);
        Task<List<SummerHandbook>> validOtpCode (string OtpCode);
        Task<bool> UpdateSummerHandbook(SummerHandbook form);
        Task<List<SummerHandbook>> getAll();
    }
}