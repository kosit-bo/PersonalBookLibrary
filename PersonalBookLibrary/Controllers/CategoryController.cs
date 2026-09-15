using Microsoft.AspNetCore.Mvc;

namespace PersonalBookLibrary.Controllers
{
    public class CategoryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
