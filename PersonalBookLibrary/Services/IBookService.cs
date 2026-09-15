using PersonalBookLibrary.Models;

namespace PersonalBookLibrary.Services
{
    public interface IBookService
    {
        Task<List<Book>> GetAllAsync(Guid? categoryId, Guid? authorId);
        Task<Book?> GetByIdAsync(Guid id);
        Task<Book> AddAsync(Book book);
        Task<bool> DeleteAsync(Guid id);
    }
}