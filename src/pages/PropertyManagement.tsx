import { useLanguage } from "../contexts/LanguageContext";
import { Wrench, Users, FileText, DollarSign, Shield, Phone } from "lucide-react";

export default function PropertyManagement() {
  const { t } = useLanguage();

  const services = [
    { icon: Wrench, title: "Maintenance Coordination", desc: "24/7 maintenance request handling and vendor management" },
    { icon: Users, title: "Tenant Relations", desc: "Screening, leasing, renewals, and conflict resolution" },
    { icon: FileText, title: "Document Management", desc: "Leases, addendums, inspections, and compliance" },
    { icon: DollarSign, title: "Rent Collection", desc: "Online portals, automated reminders, owner statements" },
    { icon: Shield, title: "Risk Management", desc: "Insurance coordination, legal compliance, eviction support" },
    { icon: Phone, title: "AI Receptionist", desc: "24/7 phone agent that handles inquiries, scheduling, and dispatch" },
  ];

  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            For Owners
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold mb-4">
            {t("nav.propertyManagement")}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            We manage 40+ rental properties across Oahu. Let us handle yours.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all">
                <div className="w-14 h-14 rounded-xl gradient-ocean flex items-center justify-center text-white mb-6">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="font-playfair text-xl font-semibold mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-cream rounded-3xl p-12">
            <h2 className="font-playfair text-3xl font-semibold mb-4">Want us to manage your property?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Get a free consultation with Christine and learn how H2O Watermark can maximize your
              rental income while minimizing your headache.
            </p>
            <a
              href="tel:8086502382"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sunset text-white rounded-xl font-semibold shadow-coral hover:bg-sunset-dark transition-all"
            >
              <Phone className="h-5 w-5" /> (808) 650-2382
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
