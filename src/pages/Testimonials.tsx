import { Star, Quote } from "lucide-react";
import { testimonials } from "../data/testimonials";
import { useLanguage } from "../contexts/LanguageContext";

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">Reviews</p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold mb-4">
            {t("testimonials.title")}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-2xl font-semibold ml-2">4.9</span>
            <span className="text-white/70 ml-2">— {t("testimonials.subtitle")}</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((tst) => (
              <div
                key={tst.id}
                className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all"
              >
                <Quote className="h-8 w-8 text-sunset mb-4" />
                <p className="text-foreground/80 leading-relaxed mb-6 italic min-h-[120px]">
                  "{tst.text}"
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-semibold text-foreground">{tst.author}</p>
                    <p className="text-xs text-muted-foreground">{tst.source}</p>
                  </div>
                  <div className="flex">
                    {[...Array(tst.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-cream rounded-3xl p-12">
            <h2 className="font-playfair text-3xl font-semibold mb-4">Worked with us?</h2>
            <p className="text-muted-foreground mb-6">
              Share your experience and help other clients find the right partner.
            </p>
            <a
              href="https://www.zillow.com/profile/H2OWatermark"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sunset text-white rounded-xl font-semibold hover:bg-sunset-dark transition-colors"
            >
              Leave a Review on Zillow
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
