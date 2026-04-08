import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const areas = [
  { slug: "waikiki", key: "areas.waikiki", img: "/images/areas/waikiki.jpg" },
  { slug: "hawaii_kai", key: "areas.hawaiiKai", img: "/images/areas/hawaii-kai.jpg" },
  { slug: "ala_moana", key: "areas.alaMoana", img: "/images/areas/ala-moana.jpg" },
  { slug: "kailua", key: "areas.kailua", img: "/images/areas/kailua.jpg" },
  { slug: "kaneohe", key: "areas.kaneohe", img: "/images/areas/kaneohe.jpg" },
  { slug: "diamond_head", key: "areas.diamondHead", img: "/images/areas/diamond-head.jpg" },
  { slug: "kapolei", key: "areas.kapolei", img: "/images/areas/kapolei.jpg" },
  { slug: "aiea", key: "areas.aiea", img: "/images/areas/aiea.jpg" },
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
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark via-ocean-dark/40 to-ocean-dark/10" />
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
