using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SummerHandbookApi.Models
{
    public class Student
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
        public string campus { get; set; }
         public string firstHealthQuestion { get; set; }
        public string secondHealthQuestion { get; set; }
        public DateTime? createdOn {get; set; }
        public DateTime? updatedOn {get; set; }
        public int parentId{ get; set; }
    }
}