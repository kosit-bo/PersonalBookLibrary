using Microsoft.EntityFrameworkCore;
using PersonalBookLibrary.Data;
using PersonalBookLibrary.Models;

namespace PersonalBookLibrary.Repositories
{
    public class AuthorRepository : IAuthorRepository
    {
        private readonly ApplicationDbContext _context;

        public AuthorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Author>> GetAllAsync()
        {
            return await _context.Authors.ToListAsync();
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Authors.AnyAsync(a => a.Id == id);
        }
    }
}