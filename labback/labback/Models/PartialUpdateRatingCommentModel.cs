using System.ComponentModel.DataAnnotations;
namespace labback.Models
{
    public class PartialUpdateRatingCommentModel
    {
        public int? Rating { get; set; }
        public string Comment { get; set; }
    }
}
