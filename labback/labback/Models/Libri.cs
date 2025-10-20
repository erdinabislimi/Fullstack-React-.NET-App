using labback.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace labback { 

public class Libri
{


        public int ID { get; set; }
        public string Isbn { get; set; }
        public string Titulli { get; set; }
        public int VitiPublikimit { get; set; }
        public int NrFaqeve { get; set; }
        public int NrKopjeve { get; set; }
        public string Gjuha { get; set; }
        public int InStock { get; set; }
        
        public string Description {  get; set; }
        public string ProfilePicturePath { get; set; }
        [NotMapped]
        public string ProfilePictureUrl { get; set; }


        public int ShtepiaBotueseID { get; set; }
        public ShtepiaBotuese ShtepiaBotuese { get; set; } 

        public int zhanriId { get; set; } 
        public Zhanri zhanri { get; set; } 

        public ICollection<RatingComment> RatingComments { get; set; }
        public ICollection<AutoriLibri> AutoriLibris { get; set; }

    }

}