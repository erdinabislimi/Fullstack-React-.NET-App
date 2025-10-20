using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace labback.Models
{
    [Table("Event")]
    public class Event
    {
        public int EventId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public DateTime EventDate { get; set; }

        public string ImagePath { get; set; } 

        public ICollection<EventRSVP> EventRSVPs { get; set; }
    }
}
