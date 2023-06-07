using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SummerHandbookApi.Models

{
    public class Parent
    {
        [Key]
        public int Id { get; set; }
        public string parentGuardianName { get; set; }
        public string emailFromParent { get; set; }
        public string phoneFromParent { get; set; }
        public string verify_code{get; set; }
        public DateTime? createdOn {get; set; }
        public DateTime? updatedOn {get; set; }
        public DateTime? parentGuardianConfirmDate { get; set; }
        public string isConfirm { get; set; }
    }
}