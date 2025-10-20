using labback.Models;
public class RatingCommentDto
{
    public int RatingsCommentID { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public int KlientID { get; set; }
    public string KlientName { get; set; } 
    public int LibriID { get; set; }
    public string LibriTitle { get; set; } 
}
