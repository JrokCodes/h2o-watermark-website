import AreasWeServe from "../components/home/AreasWeServe";
import { useLanguage } from "../contexts/LanguageContext";

export default function Areas() {
  const { t } = useLanguage();
  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">Coverage</p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold">{t("areas.title")}</h1>
        </div>
      </section>
      <AreasWeServe />
    </div>
  );
}
