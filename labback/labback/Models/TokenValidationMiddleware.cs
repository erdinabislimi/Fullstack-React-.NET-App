using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Threading.Tasks;
using labback.Models;
using Microsoft.Extensions.DependencyInjection;

public class TokenValidationMiddleware
{
    private readonly RequestDelegate _next;

    public TokenValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, IServiceScopeFactory scopeFactory)
    {
        using (var scope = scopeFactory.CreateScope())
        {
            var _context = scope.ServiceProvider.GetRequiredService<LibriContext>();

            if (context.Session.TryGetValue("refreshToken", out var refreshTokenBytes))
            {
                var refreshToken = Encoding.UTF8.GetString(refreshTokenBytes);
                var token = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);
                if (token == null)
                {
                    context.Session.Remove("refreshToken");
                }
            }
        }

        await _next(context);
    }
}
