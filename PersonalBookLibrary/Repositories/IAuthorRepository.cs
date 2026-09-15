using PersonalBookLibrary.Models;

namespace PersonalBookLibrary.Repositories
{
    public interface IAuthorRepository
    {
        Task<List<Author>> GetAllAsync();
        Task<bool> ExistsAsync(Guid id);
    }
}