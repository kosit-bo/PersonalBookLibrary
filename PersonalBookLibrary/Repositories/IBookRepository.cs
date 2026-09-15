using PersonalBookLibrary.Models;

namespace PersonalBookLibrary.Repositories
{
    public interface IBookRepository
    {
        Task<List<Book>> GetAllAsync(Guid? categoryId, Guid? authorId);
        Task<Book?> GetByIdAsync(Guid id);
        Task<Book> AddAsync(Book book);
        Task<bool> DeleteAsync(Guid id);
    }
}