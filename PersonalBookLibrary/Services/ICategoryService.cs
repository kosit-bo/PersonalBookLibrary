using PersonalBookLibrary.Models;

namespace PersonalBookLibrary.Services
{
    public interface ICategoryService
    {
        Task<List<Category>> GetAllAsync();
    }
}