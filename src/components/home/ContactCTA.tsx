import { Phone, MessageCircle, Mail } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ContactCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl p-12 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full gradient-sunset opacity-10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full gradient-ocean opacity-10 blur-3xl" />

          <div className="relative">
            <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
              Let's Connect
            </p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-semibold text-foreground mb-4">
              {t("contact.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="tel:8086502382"
                className="group p-6 rounded-2xl border-2 border-border hover:border-ocean hover:bg-ocean/5 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-ocean/10 group-hover:bg-ocean group-hover:text-white text-ocean mx-auto mb-4 flex items-center justify-center transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="font-semibold text-foreground mb-1">{t("contact.callNow")}</div>
                <div className="text-sm text-muted-foreground">(808) 650-2382</div>
              </a>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent("openChat"))}
                className="group p-6 rounded-2xl border-2 border-sunset bg-sunset/5 hover:bg-sunset hover:text-white transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-sunset/20 group-hover:bg-white text-sunset mx-auto mb-4 flex items-center justify-center transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="font-semibold text-foreground group-hover:text-white mb-1">
                  {t("contact.chatWithAmy")}
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-white/80">
                  Available 24/7
                </div>
              </button>

              <a
                href="mailto:info@h2owatermark.com"
                className="group p-6 rounded-2xl border-2 border-border hover:border-ocean hover:bg-ocean/5 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-ocean/10 group-hover:bg-ocean group-hover:text-white text-ocean mx-auto mb-4 flex items-center justify-center transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="font-semibold text-foreground mb-1">Email Us</div>
                <div className="text-sm text-muted-foreground break-all">info@h2owatermark.com</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
