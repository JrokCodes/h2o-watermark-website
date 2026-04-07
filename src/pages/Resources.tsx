import { resources } from "../data/resources";
import {
  BarChart3, GraduationCap, Calculator, Building, Shield, DollarSign,
  Map, FileText, Droplet, Users, Briefcase, ExternalLink,
} from "lucide-react";

const iconMap: Record<string, any> = {
  BarChart3, GraduationCap, Calculator, Building, Shield, DollarSign,
  Map, FileText, Droplet, Users, Briefcase,
};

export default function Resources() {

  // Group by category
  const grouped = resources.reduce<Record<string, typeof resources>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            Information
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold mb-4">
            Resources & Tools
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Helpful Hawaii real estate tools, government links, and tax forms
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-custom">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h2 className="font-playfair text-3xl font-semibold mb-6">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((r) => {
                  const Icon = r.icon ? iconMap[r.icon] : null;
                  return (
                    <a
                      key={r.id}
                      href={r.url}
                      target={r.external ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="group bg-white p-6 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all border border-border"
                    >
                      <div className="flex items-start gap-4">
                        {Icon && (
                          <div className="w-12 h-12 rounded-xl bg-ocean/10 group-hover:bg-ocean group-hover:text-white text-ocean flex items-center justify-center flex-shrink-0 transition-colors">
                            <Icon className="h-6 w-6" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground group-hover:text-ocean transition-colors">
                              {r.title}
                            </h3>
                            {r.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{r.description}</p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
