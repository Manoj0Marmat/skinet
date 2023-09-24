using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ErrorController : BaseApiController
    {
        [HttpGet("/errors/{code}")]
        public IActionResult Error(int code){
            return new ObjectResult(new ApiResponse(code));
        }
    }
}