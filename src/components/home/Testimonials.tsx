import { Star, Quote } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const reviews = [
  {
    text: "Calm, yet precisely focused professionalism. Christine handled every detail of our purchase with grace.",
    author: "Hellum",
    source: "Zillow",
  },
  {
    text: "Professional, thorough, extremely intelligent. She got me TOP dollar on my sale.",
    author: "Verified Client",
    source: "Zillow",
  },
  {
    text: "Always readily available and highly responsive. The smoothest real estate experience I've had.",
    author: "jmoon7",
    source: "Zillow",
  },
];

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="py-24 gradient-ocean text-white relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-sunset blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="text-center mb-16">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            Reviews
          </p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-semibold mb-4">
            {t("testimonials.title")}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-lg font-semibold">4.9</span>
            <span className="text-white/70">{t("testimonials.subtitle")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all"
            >
              <Quote className="h-8 w-8 text-sunset mb-4" />
              <p className="text-white/90 leading-relaxed mb-6 italic">"{review.text}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="font-semibold">{review.author}</p>
                  <p className="text-xs text-white/60">{review.source}</p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
