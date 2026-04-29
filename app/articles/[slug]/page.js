{article.post_type === "written" ? (
  <div className="article-content">{article.content}</div>
) : (
  <section className="link-preview" style={{ marginTop: 24 }}>
    <div className="section-title">Linked Article</div>
    {article.source_image ? (
      <img
        src={article.source_image}
        alt={article.source_title || "Article source preview"}
        className="preview-image"
      />
    ) : null}
    <h2 style={{ marginTop: 12 }}>{article.source_title || article.title}</h2>
    <p>{article.source_description || article.content}</p>
    <a href={article.source_url} target="_blank" rel="noopener noreferrer">
      Open original article
    </a>
  </section>
)}