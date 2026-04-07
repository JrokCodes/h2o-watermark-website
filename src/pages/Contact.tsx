import { useLanguage } from "../contexts/LanguageContext";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            {t("contact.title")}
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold">{t("contact.title")}</h1>
          <p className="text-xl text-white/80 mt-4">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="font-playfair text-3xl font-semibold mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-ocean/10 text-ocean flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                      {t("contact.callNow")}
                    </div>
                    <a href="tel:8086502382" className="text-xl font-semibold text-foreground hover:text-ocean">
                      (808) 650-2382
                    </a>
                    <div className="text-sm text-muted-foreground mt-1">Office</div>
                    <a href="tel:8082854357" className="block text-sm text-foreground hover:text-ocean">
                      (808) 285-4357 — Christine direct
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-ocean/10 text-ocean flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Email</div>
                    <a href="mailto:info@h2owatermark.com" className="block text-foreground hover:text-ocean">
                      info@h2owatermark.com
                    </a>
                    <a href="mailto:rentals@h2owatermark.com" className="block text-foreground hover:text-ocean">
                      rentals@h2owatermark.com
                    </a>
                    <a href="mailto:aloha.ckim@h2owatermark.com" className="block text-foreground hover:text-ocean">
                      aloha.ckim@h2owatermark.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-ocean/10 text-ocean flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                      {t("contact.officeAddress")}
                    </div>
                    <p className="text-foreground">
                      1314 S. King St. Suite 718<br />
                      Honolulu, HI 96814
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-ocean/10 text-ocean flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                      {t("contact.officeHours")}
                    </div>
                    <p className="text-foreground">{t("contact.officeHoursValue")}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI receptionist available 24/7 via phone or chat
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent("openChat"))}
                className="mt-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-sunset hover:bg-sunset-dark text-white rounded-xl font-semibold shadow-coral transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" />
                {t("contact.chatWithAmy")}
              </button>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <h2 className="font-playfair text-3xl font-semibold mb-6">Send a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t("contact.name")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-cream/50 border border-border rounded-xl focus:outline-none focus:border-ocean"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t("contact.email")}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-cream/50 border border-border rounded-xl focus:outline-none focus:border-ocean"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t("contact.phone")}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-cream/50 border border-border rounded-xl focus:outline-none focus:border-ocean"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t("contact.message")}
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 bg-cream/50 border border-border rounded-xl focus:outline-none focus:border-ocean resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-ocean hover:bg-ocean-dark text-white rounded-xl font-semibold transition-colors"
                >
                  {t("contact.send")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
