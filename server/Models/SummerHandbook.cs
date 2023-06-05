using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SummerHandbookApi.Models
{
    public class SummerHandbook
    {
        
        [Key]
        public int Id { get; set; }
        public string studentCode { get; set; }
        //Student
        public string studentName { get; set; }
        public string gender { get; set; }
        public DateTime DOB { get; set; }
        public string address { get; set; }
        public string grade { get; set; }
        public string schoolYear { get; set; }
        public string campus { get; set; }
        public string emailFromParent { get; set; }
        public string phoneFromParent { get; set; }
        public string parentGuardianName { get; set; }
      
        public string verify_code{get; set; }
        public DateTime createdOn {get; set; }
        public DateTime updatedOn {get; set; }
        public DateTime? parentGuardianConfirmDate { get; set; }
        public string isConfirm { get; set; }
    }
    
}