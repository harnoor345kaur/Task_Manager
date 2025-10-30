using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TaskManagerApi.Models;

var builder = WebApplication.CreateBuilder(args);


// Allow CORS for local frontend (Vite default port 5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost5173", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add swagger for quick testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();


app.UseCors("AllowLocalhost5173");


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// In-memory storage
var tasks = new List<TaskItem>
{
    new TaskItem { Id = Guid.NewGuid(), Description = "Buy groceries", IsCompleted = false },
    new TaskItem { Id = Guid.NewGuid(), Description = "Read a chapter", IsCompleted = true }
};

app.MapGet("/api/tasks", () => Results.Ok(tasks));


app.MapPost("/api/tasks", (TaskItem input) =>
{
    var item = new TaskItem
    {
        Id = Guid.NewGuid(),
        Description = input.Description ?? string.Empty,
        IsCompleted = input.IsCompleted
    };
    tasks.Add(item);
    return Results.Created($"/api/tasks/{item.Id}", item);
});

app.MapPut("/api/tasks/{id}", (Guid id, TaskItem update) =>
{
    var existing = tasks.FirstOrDefault(t => t.Id == id);
    if (existing == null) return Results.NotFound();


    // Update fields
    existing.Description = update.Description ?? existing.Description;
    existing.IsCompleted = update.IsCompleted;


    return Results.NoContent();
});


app.MapDelete("/api/tasks/{id}", (Guid id) =>
{
    var existing = tasks.FirstOrDefault(t => t.Id == id);
    if (existing == null) return Results.NotFound();


    tasks.Remove(existing);
    return Results.NoContent();
});

// Optional: listen on known port so frontend fetches are predictable
app.Urls.Add("http://localhost:5000");


app.Run();

