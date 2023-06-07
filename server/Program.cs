using Microsoft.EntityFrameworkCore;
using SummerHandbookApi;
using SummerHandbookApi.Data;
using SummerHandbookApi.Repositories.SummerHandbookRepository;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Builder;
using SummerHandbookApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

 builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: MyAllowSpecificOrigins,
                                policy =>
                                {
                                    policy.WithOrigins("http://localhost:3000")
                                    .AllowAnyMethod()
                                    .AllowAnyHeader()
                                    .AllowCredentials();
                                });
        });
// Add services to the container.
builder.Services.AddDbContext<SummerHandbookDataContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("SummerHandbookConnection"),
                providerOptions => providerOptions.EnableRetryOnFailure()));

builder.Services.AddScoped<ISummerHandbookRepository, SummerHandbookRepository>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddScoped<ISummerHandbookDataContext, SummerHandbookDataContext>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "VAS School Bus API", Version = "v1" });
});


var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "VAS School Bus v1"));
} else {

}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);


app.MapControllers();


app.Run();
