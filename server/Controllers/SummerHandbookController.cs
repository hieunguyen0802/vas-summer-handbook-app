using System.Security.AccessControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MimeKit.Text;
using RestSharp;
using SummerHandbookApi.Models;
using SummerHandbookApi.Repositories.SummerHandbookRepository;

namespace SummerHandbookApi.Controllers
{
    [ApiController]
    [Route("/[action]")]
    public class SummerHandbookController : ControllerBase
    {
        private readonly ISummerHandbookRepository _summerHandbookRepository;
        public SummerHandbookController(ISummerHandbookRepository summerHandbookRepository)
        {
            _summerHandbookRepository = summerHandbookRepository;
        }

        [HttpGet]
        public async Task<IActionResult> getTestTable(string email){
            if (email != null)
            {
                return Ok(await _summerHandbookRepository.validParent(email));
            }
            return BadRequest("error");
        }

        [HttpGet]
        public async Task<IActionResult> getParent(string email)
        {
            try
            {
                var parent = await _summerHandbookRepository.validParent(email);
                if (parent == null) return NotFound(new { message = "Fail", info = "Email hoặc số điện thoại không tồn tại trong hệ thống. Quý phụ huynh vui lòng thử lại! - Your credentials is not valid, please check back" });
                Random generator = new Random();
                String code = generator.Next(0, 1000000).ToString("D6");
                var isExistParent = await _summerHandbookRepository.getParentInfo(parent.FirstOrDefault().emailFromParent);
                if (isExistParent != null)
                {
                    isExistParent.verify_code = code;
                    isExistParent.updatedOn = DateTime.Now;
                    await _summerHandbookRepository.UpdateSummerHandbook(isExistParent);
                    SendEmail(isExistParent);
                    //sendSMSAsync(isExistParent);             
                }
                else
                {   
                    var getAll = await _summerHandbookRepository.getAll();
                    var id = getAll.Count() + 1;
                    parent.FirstOrDefault().Id = id;
                    parent.FirstOrDefault().verify_code = code;
                    parent.FirstOrDefault().updatedOn = DateTime.Now;
                    parent.FirstOrDefault().createdOn = DateTime.Now;
                    await _summerHandbookRepository.insertParentCode(parent.FirstOrDefault());
                    SendEmail(parent.FirstOrDefault());
                    //sendSMSAsync(isExistParent);    
                }
                return Ok(new { message = "Success", data = code });

            }
            catch (System.Exception e)
            {
                System.Console.WriteLine(e.Message);
                return NotFound(new { message = "Fail", info = "Email hoặc số điện thoại không tồn tại trong hệ thống. Quý phụ huynh vui lòng thử lại! - Your credentials is not valid, please check back" });
            }
        }
        [HttpGet]
        public async Task<IActionResult> ValidOTP(string OtpCode)
        {
            if (OtpCode != null)
            {
                return Ok(new { message = "Success", data = await _summerHandbookRepository.validOtpCode(OtpCode)});
            }
            return BadRequest(new { message = "Fail", info = "Invalid OTP Code" });
        }

        [HttpPost]
        public async Task<IActionResult> Confirm(SummerHandbook form)
        {
            if (form == null)
            {
                return BadRequest(new { message = "Fail", info = "Error occured, please try again or contact admission for more information" });
            }
            form.isConfirm = "true";
            form.parentGuardianConfirmDate = DateTime.Now;
            return Ok(new { message = "Success", data = await _summerHandbookRepository.UpdateSummerHandbook(form) });
        }

        [HttpGet]
        public async Task<IActionResult> ResendOTP(string oldOtpCode)
        {
            try

            {
                var isValid = await _summerHandbookRepository.validOtpCode(oldOtpCode);
                Random generator = new Random();
                String code = generator.Next(0, 1000000).ToString("D6");
                isValid.FirstOrDefault().verify_code = code;
                isValid.FirstOrDefault().updatedOn = DateTime.Now;
                await _summerHandbookRepository.UpdateSummerHandbook(isValid.FirstOrDefault());
                SendEmail(isValid.FirstOrDefault());
                return Ok(new { message = "Success", newOTP = code });
            }
            catch (System.Exception e)
            {   
                System.Console.WriteLine(e.Message);
                return BadRequest("Error");
            }

        }

        #region support methods
        private bool SendEmail(SummerHandbook form)
        {
            try
            {
                // create email message
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("webmaster@vas.edu.vn"));
                email.To.Add(MailboxAddress.Parse("hieu.trung.nguyen2@vas.edu.vn"));
                email.Subject = "[VAS - Automatic Email] Your OTP Code for Summer Handbook Confirmation";
                email.Body = new TextPart(TextFormat.Html) { Text = "<h3>Your OTP Code is <font color=red><b>" + form.verify_code + "</b></font>  </h3>" };

                // send email
                using var smtp = new SmtpClient();
                smtp.Connect("smtp.office365.com", 587, SecureSocketOptions.StartTls);
                smtp.Authenticate("webmaster@vas.edu.vn", "123Abc@@");
                smtp.Send(email);
                smtp.Disconnect(true);
                return true;
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
                return false;
            }
        }
        private bool sendSMSAsync(SummerHandbook form)
        {
            try
            {
                var textMessage = "Summer Handbook Confirmation - Your OTP code is: " + form.verify_code;
                Uri baseUrl = new Uri("https://cloudsms.vietguys.biz:4438/api/");
                RestClient client = new RestClient(baseUrl);
                RestRequest request = new RestRequest(baseUrl, Method.Get);
                //Parameter
                request.AddParameter("u", "ts24_api", ParameterType.QueryString);
                request.AddParameter("pwd", "b8gct", ParameterType.QueryString);
                request.AddParameter("from", "VIET UC", ParameterType.QueryString);
                //request.AddParameter("phone", form.phoneFromParent, ParameterType.QueryString);
                request.AddParameter("phone", "0393684140", ParameterType.QueryString);
                request.AddParameter("sms", textMessage, ParameterType.QueryString);
                var response = client.ExecuteAsync(request);
                return true;

            }
            catch (System.Exception e)
            {
                System.Console.WriteLine(e.Message);
                return false;
            }

        }
#endregion 

    }
}