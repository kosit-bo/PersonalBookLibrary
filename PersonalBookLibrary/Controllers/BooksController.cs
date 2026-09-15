using Microsoft.AspNetCore.Mvc;
using PersonalBookLibrary.Models;
using PersonalBookLibrary.Services;

namespace PersonalBookLibrary.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _service;

        public BooksController(IBookService service)
        {
            _service = service;
        }

        // GET: /api/books
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] Guid? categoryId,
            [FromQuery] Guid? authorId)
        {
            var books = await _service.GetAllAsync(categoryId, authorId);

            if (categoryId.HasValue)
            {
                books = books
                    .Where(b => b.CategoryId == categoryId.Value)
                    .ToList();
            }

            if (authorId.HasValue)
            {
                books = books
                    .Where(b => b.AuthorId == authorId.Value)
                    .ToList();
            }

            return Ok(books);
        }

        // GET: /api/books/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var book = await _service.GetByIdAsync(id);

            if (book == null)
                return NotFound();

            return Ok(book);
        }

        // POST: /api/books
        [HttpPost]
        public async Task<IActionResult> Create(Book book)
        {
            try
            {
                var createdBook = await _service.AddAsync(book);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = createdBook.Id },
                    createdBook
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // DELETE: /api/books/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}