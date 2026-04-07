import { newsArticles } from "../data/news";
import { Calendar, Tag } from "lucide-react";

export default function News() {
  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">News</p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold mb-4">
            Real Estate News
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Hawaii market insights, transactions, and industry updates
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {article.category}
                    </span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-foreground mb-3 group-hover:text-ocean transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
