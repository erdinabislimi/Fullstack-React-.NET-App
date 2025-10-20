namespace labback.Models
{
    public class UseCaseEvaluationRequest
    {
        public UseCaseSet Generated { get; set; }
        public UseCaseSet Expected { get; set; }
    }

    public class UseCaseSet
    {
        public List<string> Actors { get; set; }
        public List<UseCaseItem> Use_Cases { get; set; }
    }

    public class UseCaseItem
    {
        public string Title { get; set; }
        public string Actor { get; set; }
        public string Description { get; set; }
    }
}
