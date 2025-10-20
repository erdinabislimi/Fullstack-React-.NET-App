using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.ComponentModel.DataAnnotations;

namespace labback.Models
{
    public class EventUpdateModel
    {
        [Required(ErrorMessage = "Event name is required.")]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required(ErrorMessage = "Event date is required.")]
        public DateTime? EventDate { get; set; }

        
        public IFormFile? Image { get; set; }

       
        public string? ImagePath { get; set; }
    }

}
