using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MimeKit.Text;
using SummerHandbookApi.Models;
using SummerHandbookApi.Repositories.SummerHandbookRepository;

namespace SummerHandbookApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class SummerHandbookController : ControllerBase
    {
        private readonly ISummerHandbookRepository _summerHandbookRepository;
        public SummerHandbookController(ISummerHandbookRepository summerHandbookRepository)
        {
            _summerHandbookRepository = summerHandbookRepository;
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
                    //send email and sms                
                }
                else
                {
                    parent.FirstOrDefault().verify_code = code;
                    parent.FirstOrDefault().updatedOn = DateTime.Now;
                    parent.FirstOrDefault().createdOn = DateTime.Now;
                    await _summerHandbookRepository.insertParentCode(parent.FirstOrDefault());
                    SendEmail(parent.FirstOrDefault());
                    //send email and sms
                }
                return Ok(new { message = "Success", data = code });

            }
            catch (System.Exception)
            {
                return NotFound(new { message = "Fail", info = "Email hoặc số điện thoại không tồn tại trong hệ thống. Quý phụ huynh vui lòng thử lại! - Your credentials is not valid, please check back" });
            }
        }
        [HttpPost]
        public async Task<IActionResult> ValidOTP(string OtpCode)
        {
            if (OtpCode != null)
            {
                return Ok(new { message = "Success", data = await _summerHandbookRepository.validOtpCode(OtpCode) });
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
            return Ok(new { message = "Success", data = await _summerHandbookRepository.UpdateSummerHandbook(form) });
        }

        [HttpPost]
        public IActionResult SendEmail(SummerHandbook form)
        {
            try
            {
                // create email message
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("webmaster@vas.edu.vn"));
                email.To.Add(MailboxAddress.Parse("to_address@example.com"));
                email.Subject = "[VAS - Automatic Email] Your OTP Code";
                email.Body = new TextPart(TextFormat.Plain) { Text = "<h1>Your OTP Code is </h1>" + form.verify_code };

                // send email
                using var smtp = new SmtpClient();
                smtp.Connect("smtp.office365.com", 587, SecureSocketOptions.StartTls);
                smtp.Authenticate("webmaster@vas.edu.vn", "123Abc@@");
                smtp.Send(email);
                smtp.Disconnect(true);
                return Ok("sent");
            }
            catch (System.Exception)
            {
                return BadRequest("Error");
            }

        }
       /*  public interface INotificationExtension
        {
            bool sendSMS(string phone_number, string message);
        }
        public class NotificationExtension : INotificationExtension
        {
            public bool sendSMS(string phone_number, string message)
            {
                Uri baseUrl = new Uri("https://cloudsms.vietguys.biz:4438/api/");
                IRestClient client = new RestClient(baseUrl);
                IRestRequest request = new RestRequest(Method.GET);
                //Parameter
                request.AddParameter("u", "ts24_api", ParameterType.QueryString);
                request.AddParameter("pwd", "b8gct", ParameterType.QueryString);
                request.AddParameter("from", "VIET UC", ParameterType.QueryString);
                request.AddParameter("phone", phone_number, ParameterType.QueryString);
                request.AddParameter("sms", message, ParameterType.QueryString);

                var response = client.Execute(request);

                if (response.IsSuccessful)
                {
                    return true;
                }
                return false;
            }

        } */
    }
}