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
using AutoMapper;

namespace SummerHandbookApi.Controllers
{
    [ApiController]
    [Route("/[action]")]
    public class SummerHandbookController : ControllerBase
    {
        private readonly ISummerHandbookRepository _summerHandbookRepository;
        private readonly IMapper _mapper;

        public SummerHandbookController(ISummerHandbookRepository summerHandbookRepository, IMapper mapper)
        {
            _summerHandbookRepository = summerHandbookRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> getTestTable(string email)
        {
            if (email != null)
            {
                var parent = await _summerHandbookRepository.getParentInfoByEmail(email);
                return Ok(await _summerHandbookRepository.validOtpCode(parent.verify_code));
            }
            return BadRequest("error");
        }

        [HttpGet]
        public async Task<IActionResult> getParent(string email)
        {
            try
            {
                var parent = await _summerHandbookRepository.validParent(email);
                if (parent.FirstOrDefault() == null) return NotFound(new { message = "Fail", info = "Email hoặc số điện thoại không tồn tại trong hệ thống. Quý phụ huynh vui lòng thử lại! - Your credentials is not valid, please check back" });
                Random generator = new Random();
                String code = generator.Next(0, 1000000).ToString("D6");

                var isExistParent = await _summerHandbookRepository.getParentInfoByEmail(parent.FirstOrDefault().emailFromParent);
                if (isExistParent != null)
                {
                    isExistParent.verify_code = code;
                    isExistParent.updatedOn = DateTime.Now;
                    await _summerHandbookRepository.UpdateParent(isExistParent);
                    SendEmail(isExistParent);
                }
                else
                {
                    var parentMapper = _mapper.Map<SummerHandbook, Parent>(parent.FirstOrDefault());
                    var allParent = await _summerHandbookRepository.getAllParent();
                    parentMapper.Id = allParent.Count() + 1;
                    parentMapper.verify_code = code;
                    parentMapper.createdOn = DateTime.Now;
                    parentMapper.updatedOn = DateTime.Now;
                    await _summerHandbookRepository.insertParent(parentMapper);

                    foreach (var item in parent)
                    {
                        var studentMapper = _mapper.Map<SummerHandbook, Student>(item);
                        var allStudent = await _summerHandbookRepository.getAllStudent();
                        //student
                        studentMapper.Id = allStudent.Count() + 1;
                        studentMapper.createdOn = DateTime.Now;
                        studentMapper.updatedOn = DateTime.Now;
                        studentMapper.parentId = parentMapper.Id;
                        await _summerHandbookRepository.insertStudent(studentMapper);
                    }
                    SendEmail(parentMapper);
                }
                //sendSMSAsync(isExistParent);    
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
                return Ok(new { message = "Success", data = await _summerHandbookRepository.validOtpCode(OtpCode) });
            }
            return BadRequest(new { message = "Fail", info = "Invalid OTP Code" });
        }

        [HttpPost]
        public async Task<IActionResult> Confirm([FromBody] List<Student> form)
        {
            if (form == null)
            {
                return BadRequest(new { message = "Fail", info = "Error occured, please try again or contact admission for more information" });
            }
            var parent = await _summerHandbookRepository.getParentInfoById(form.FirstOrDefault().parentId);
            parent.isConfirm = "true";
            parent.parentGuardianConfirmDate = DateTime.Now;    
            await _summerHandbookRepository.UpdateParent(parent);

            foreach (var item in form)
                {
                    await _summerHandbookRepository.updateStudent(item);
                }
        
            return Ok(new { message = "Success"});
        }

        [HttpGet]
        public async Task<IActionResult> ResendOTP(string oldOtpCode)
        {
            try

            {
                var isValid = await _summerHandbookRepository.validOtpFromParent(oldOtpCode);
                Random generator = new Random();
                String code = generator.Next(0, 1000000).ToString("D6");
                isValid.verify_code= code;
                isValid.updatedOn = DateTime.Now;
                await _summerHandbookRepository.UpdateParent(isValid);
                SendEmail(isValid);
                return Ok(new { message = "Success", newOTP = code });
            }
            catch (System.Exception e)
            {
                System.Console.WriteLine(e.Message);
                return BadRequest("Error");
            }

        }

        #region support methods
        private bool SendEmail(Parent form)
        {
            try
            {
                // create email message
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("webmaster@vas.edu.vn"));
                email.To.Add(MailboxAddress.Parse("hieu.trung.nguyen2@vas.edu.vn"));
                email.Subject = "[VAS - Automatic Email] Your OTP Code for Summer Handbook Confirmation";
                email.Body = new TextPart(TextFormat.Html) { Text = "<h3>Your OTP Code is <font color=red><b>" + form.verify_code + "</b></font>. Please do not share with anyone. Shall you need more information please contact our admission team. Thank you ! </h3>" };

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
        private bool sendSMSAsync(Parent form)
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