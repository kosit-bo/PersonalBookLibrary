using PersonalBookLibrary.Models;
using PersonalBookLibrary.Repositories;

namespace PersonalBookLibrary.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _repository;
        private readonly IAuthorRepository _authorRepository;
        private readonly ICategoryRepository _categoryRepository;

        public BookService(
            IBookRepository repository,
            IAuthorRepository authorRepository,
            ICategoryRepository categoryRepository)
        {
            _repository = repository;
            _authorRepository = authorRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<List<Book>> GetAllAsync(Guid? categoryId, Guid? authorId)
        {
            return await _repository.GetAllAsync(categoryId, authorId);
        }

        public async Task<Book?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Book> AddAsync(Book book)
        {
            var authorExists = await _authorRepository.ExistsAsync(book.AuthorId);

            if (!authorExists)
                throw new ArgumentException("Author not found.");

            var categoryExists = await _categoryRepository.ExistsAsync(book.CategoryId);

            if (!categoryExists)
                throw new ArgumentException("Category not found.");

            if (book.Id == Guid.Empty)
                book.Id = Guid.NewGuid();

            return await _repository.AddAsync(book);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}