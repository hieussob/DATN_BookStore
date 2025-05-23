﻿using BookStore.Context;
using BookStore.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services
{
    public class UsersService : IUsersService
    {
        private readonly DbBookContext _context;
        private readonly IdentityContext _identityContext;

        public UsersService(DbBookContext context, IdentityContext identityContext)
        {
            _context = context;
            _identityContext = identityContext;
        }

        public async Task<IEnumerable<object>> GetUsersAsync()
        {
            var queryIdentityUser = await _identityContext.Users
                .Select(us => new { us.Email, us.LockoutEnd })
                .ToListAsync();

            var query = await _context.Users
                .OrderByDescending(us => us.Created)
                .Select(us => new 
                {
                    us.Id, us.FullName, us.PhoneNumber, us.DateOfBirth, us.Email, us.Address
                })
                .ToListAsync();

            return query.Join(queryIdentityUser,
                us => us.Email,
                ui => ui.Email,
                (us, ui) => new 
                {
                    us.Id, us.FullName, us.PhoneNumber, us.DateOfBirth, us.Email, us.Address,
                    Status = ui.LockoutEnd != null && ui.LockoutEnd > DateTimeOffset.Now ? "Đang khóa" : "Hoạt động"
                }).ToList();
        }

        public async Task<object?> GetUserByIdAsync(Guid id)
        {
            return await (from us in _context.Users
                          join or in _context.Orders on us.Id equals or.UserId into odGroup
                          from or in odGroup.DefaultIfEmpty()
                          group or by us into grouped
                          where grouped.Key.Id == id
                          select new
                          {
                              grouped.Key.Address, grouped.Key.Email, grouped.Key.PhoneNumber,
                              grouped.Key.Id, grouped.Key.DateOfBirth, grouped.Key.FullName,
                              Orders = grouped.Where(o => o != null).Select(o => new
                              {
                                  o.Id, o.Created, o.TotalPrice, o.Code, o.Status
                              }).ToList()
                          }).FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateUserAsync(Guid id, User user)
        {
            if (id != user.Id) return false;

            _context.Entry(user).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return _context.Users.Any(e => e.Id == id);
            }
        }

        public async Task<bool> CreateUserAsync(User user)
        {
            user.Created = DateTime.Now;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<IEnumerable<object>> GetListUserForAdminSupportAsync()
        {
            return await (from ac in _context.Users
                          select new
                          {
                              userId = ac.Id,
                              email = ac.Email,
                              fullName = ac.FullName,
                              tinNhanGanNhat = (
                              from cb in _context.Chatboxes
                              where cb.UserId == ac.Id
                              orderby cb.Created descending
                              select cb.Message
                              ).FirstOrDefault()
                          }).OrderByDescending(x => x.tinNhanGanNhat).ToListAsync();
        }
    }
}
