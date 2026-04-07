import { Calendar, Clock, MapPin, MessageCircle } from "lucide-react";

const openHouses = [
  {
    id: 1,
    property: "The Watermark, Unit 3104",
    address: "1551 Ala Wai Blvd, Honolulu",
    date: "Sunday, April 13, 2026",
    time: "1:00 PM – 3:00 PM",
    description: "Luxury 2BR/2BA with ocean views — $5,750/mo",
  },
  {
    id: 2,
    property: "Villa on Eaton Square, Unit 2614",
    address: "400 Hobron, Honolulu",
    date: "Saturday, April 19, 2026",
    time: "11:00 AM – 1:00 PM",
    description: "Fully furnished 1BR — $2,798/mo",
  },
  {
    id: 3,
    property: "1090 Kahului St",
    address: "Hawaii Kai, Honolulu",
    date: "Sunday, April 20, 2026",
    time: "2:00 PM – 4:00 PM",
    description: "Stunning 6BR home in Hawaii Kai — $13,800/mo",
  },
];

export default function OpenHouses() {
  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            Visit in Person
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold mb-4">Open Houses</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Scheduled showings and open houses across Oahu
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-custom max-w-4xl">
          <div className="space-y-4">
            {openHouses.map((oh) => (
              <div
                key={oh.id}
                className="bg-white p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                    {oh.property}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{oh.description}</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Calendar className="h-4 w-4 text-ocean" />
                      <span>{oh.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Clock className="h-4 w-4 text-ocean" />
                      <span>{oh.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <MapPin className="h-4 w-4 text-ocean" />
                      <span>{oh.address}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("openChat", { detail: { property: oh.property } })
                    )
                  }
                  className="flex items-center gap-2 px-5 py-3 bg-sunset hover:bg-sunset-dark text-white rounded-xl font-medium transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4" />
                  RSVP with Amy
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-cream rounded-3xl p-10">
            <h2 className="font-playfair text-2xl font-semibold mb-3">
              Don't see what you're looking for?
            </h2>
            <p className="text-muted-foreground mb-6">
              Schedule a private showing at any property anytime — chat with Amy 24/7.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("openChat"))}
              className="inline-flex items-center gap-2 px-6 py-3 bg-ocean hover:bg-ocean-dark text-white rounded-xl font-semibold transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Start Chat
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
