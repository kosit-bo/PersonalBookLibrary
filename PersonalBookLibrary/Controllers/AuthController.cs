using Microsoft.AspNetCore.Mvc;

namespace PersonalBookLibrary.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
