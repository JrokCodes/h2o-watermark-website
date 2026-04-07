import { developments } from "../data/developments";
import { Calendar, MapPin } from "lucide-react";

export default function Developments() {
  const upcoming = developments.filter((d) => d.status === "upcoming");
  const completed = developments.filter((d) => d.status === "completed");

  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            New Construction
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold mb-4">
            New Projects & Developments
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Tracking Hawaii's most anticipated new buildings and developments
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-custom">
          <h2 className="font-playfair text-3xl font-semibold mb-2">Upcoming Projects</h2>
          <p className="text-muted-foreground mb-8">
            Pre-construction and recently completed luxury developments
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {d.imageUrl && (
                    <img
                      src={d.imageUrl}
                      alt={d.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-sunset text-white text-xs font-semibold rounded-full">
                    {d.completion}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-xl font-semibold mb-3">{d.name}</h3>
                  <div className="flex items-start gap-1.5 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>{d.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4 text-ocean" />
                    <span>Estimated completion: {d.completion}</span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">{d.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-playfair text-3xl font-semibold mt-16 mb-2">Recent Completions</h2>
          <p className="text-muted-foreground mb-8">Notable luxury buildings completed in recent years</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((d) => (
              <div key={d.id} className="bg-cream rounded-xl p-5 border border-border">
                <h3 className="font-playfair text-lg font-semibold mb-1">{d.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {d.location} · Completed {d.completion}
                </p>
                <p className="text-sm text-foreground/70">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
