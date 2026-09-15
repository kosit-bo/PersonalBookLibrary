using Microsoft.AspNetCore.Mvc;

namespace PersonalBookLibrary.Controllers
{
    public class BooksController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
