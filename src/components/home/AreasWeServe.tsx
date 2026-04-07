import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const areas = [
  { slug: "waikiki", key: "areas.waikiki", img: "https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=600&q=80" },
  { slug: "hawaii_kai", key: "areas.hawaiiKai", img: "https://images.unsplash.com/photo-1571417618486-66d68f4d7843?w=600&q=80" },
  { slug: "ala_moana", key: "areas.alaMoana", img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80" },
  { slug: "kailua", key: "areas.kailua", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
  { slug: "kaneohe", key: "areas.kaneohe", img: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=600&q=80" },
  { slug: "diamond_head", key: "areas.diamondHead", img: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&q=80" },
  { slug: "kapolei", key: "areas.kapolei", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
  { slug: "aiea", key: "areas.aiea", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80" },
];

export default function AreasWeServe() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            Coverage
          </p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-semibold text-foreground mb-4">
            {t("areas.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("areas.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {areas.map((area) => (
            <Link
              to={`/rentals?area=${area.slug}`}
              key={area.slug}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
            >
              <img
                src={area.img}
                alt={t(area.key)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark via-ocean-dark/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="font-playfair text-2xl font-semibold mb-1">{t(area.key)}</h3>
                <div className="flex items-center gap-1.5 text-xs text-white/80 group-hover:text-sunset transition-colors">
                  <span>View properties</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
