import { Award, Globe, Scale, Building2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Award,
      title: t("whyUs.item1Title"),
      desc: t("whyUs.item1Desc"),
    },
    {
      icon: Globe,
      title: t("whyUs.item2Title"),
      desc: t("whyUs.item2Desc"),
    },
    {
      icon: Scale,
      title: t("whyUs.item3Title"),
      desc: t("whyUs.item3Desc"),
    },
    {
      icon: Building2,
      title: t("whyUs.item4Title"),
      desc: t("whyUs.item4Desc"),
    },
  ];

  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      {/* Decorative wave */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ocean/20 to-transparent" />

      <div className="container-custom relative">
        <div className="text-center mb-16">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            Our Difference
          </p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-semibold text-foreground mb-4">
            {t("whyUs.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("whyUs.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-8 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-xl gradient-ocean flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
