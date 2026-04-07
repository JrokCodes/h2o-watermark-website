import { useLanguage } from "../contexts/LanguageContext";
import { Quote, Award, Globe, Scale, Briefcase } from "lucide-react";

export default function About() {
  const { t } = useLanguage();

  const team = [
    { name: "Christine Kim", role: "Broker / Owner", email: "aloha.ckim@h2owatermark.com", phone: "(808) 285-4357" },
    { name: "Ivy Dioso", role: "Senior Operations Manager", email: "Ivy@h2owatermark.com" },
    { name: "Cynthia Avenue", role: "Property Management Assistant", email: "cynthia.h2owatermark@gmail.com" },
    { name: "Charmainne Rivera", role: "Property Management Assistant", email: "charmaine.h2o@gmail.com" },
    { name: "Vanessa Rivera", role: "Maintenance Coordinator", email: "vanessa@h2owatermark.com" },
  ];

  const credentials = [
    { icon: Scale, label: "J.D. (Juris Doctor)" },
    { icon: Award, label: "Licensed Real Estate Broker — RB-20727, RB-20728" },
    { icon: Briefcase, label: "Founder, H2O Watermark Pacific Properties LLC (since 2011)" },
    { icon: Globe, label: "Multilingual team: English, Korean, Japanese, Mandarin" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            {t("about.subtitle")}
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold">{t("about.title")}</h1>
        </div>
      </section>

      {/* Bio + photo */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-cream w-56 sm:w-64 mx-auto lg:mx-0">
                <img
                  src="/images/christine.jpg"
                  alt="Christine Kim, J.D. — Broker"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              <h2 className="font-playfair text-4xl font-semibold text-foreground mb-6">
                Real Estate, Refined.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">{t("about.bio")}</p>
              <p className="text-muted-foreground mb-8">
                Since founding H2O Watermark Pacific Properties in 2011, Christine has built a
                reputation for sophisticated negotiation, attentive client service, and a deep
                rolodex spanning Hawaii's residential, investment, and rental real estate markets.
              </p>

              {/* Credentials */}
              <div className="space-y-3 mb-10">
                {credentials.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center text-ocean">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <span className="text-foreground">{c.label}</span>
                  </div>
                ))}
              </div>

              {/* Philosophy quote */}
              <div className="relative pl-6 border-l-4 border-sunset py-2">
                <Quote className="absolute -top-2 -left-3 h-6 w-6 text-sunset bg-background" />
                <p className="font-playfair text-xl italic text-foreground/80 mb-2">
                  "{t("about.quote")}"
                </p>
                <p className="text-sm text-muted-foreground">— Christine Kim, J.D.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">Our Team</p>
            <h2 className="font-playfair text-4xl font-semibold">Meet the H2O Watermark Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
                <div className="w-16 h-16 rounded-full gradient-ocean flex items-center justify-center text-white font-playfair text-2xl font-semibold mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-playfair text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-sunset mb-3">{member.role}</p>
                {member.phone && (
                  <a href={`tel:${member.phone.replace(/\D/g, "")}`} className="block text-sm text-muted-foreground hover:text-ocean">
                    {member.phone}
                  </a>
                )}
                <a href={`mailto:${member.email}`} className="block text-sm text-muted-foreground hover:text-ocean break-all">
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
