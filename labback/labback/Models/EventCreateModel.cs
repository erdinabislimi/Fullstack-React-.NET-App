// Models/EventCreateModel.cs
using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace labback.Models
{
    public class EventCreateModel
    {
        [Required(ErrorMessage = "Event name is required.")]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required(ErrorMessage = "Event date is required.")]
        public DateTime EventDate { get; set; }

        public IFormFile Image { get; set; }
    }
}
