using PersonalBookLibrary.Models;

namespace PersonalBookLibrary.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllAsync();
        Task<bool> ExistsAsync(Guid id);
    }
}