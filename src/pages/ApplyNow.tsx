import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ApplyNow() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            Rental Application
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold mb-4">Apply Now</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Found a property you love? Submit your application to get started.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-custom max-w-3xl">
          {submitted ? (
            <div className="bg-white p-12 rounded-2xl shadow-card text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="font-playfair text-3xl font-semibold mb-3">Application Received!</h2>
              <p className="text-muted-foreground">
                Thank you for applying. Christine will review your application and reach out within 1
                business day.
              </p>
            </div>
          ) : (
            <form
              className="bg-white p-8 sm:p-10 rounded-2xl shadow-card space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Full Name *" type="text" required />
                <Field label="Phone *" type="tel" required />
              </div>
              <Field label="Email *" type="email" required />
              <Field label="Property of Interest" type="text" placeholder="e.g., The Watermark #3104" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Desired Move-in Date" type="date" />
                <Field label="Lease Length (months)" type="number" placeholder="12" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Employer" type="text" />
                <Field label="Annual Income" type="text" placeholder="$60,000" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-cream/50 border border-border rounded-xl focus:outline-none focus:border-ocean resize-none"
                  placeholder="Pets, special requests, references, etc."
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-4 bg-sunset hover:bg-sunset-dark text-white rounded-xl font-semibold shadow-coral transition-all hover:-translate-y-0.5"
                >
                  Submit Application
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                By submitting, you agree to be contacted by H2O Watermark Pacific Properties about your
                rental inquiry.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  type,
  required,
  placeholder,
}: {
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-2 block">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-cream/50 border border-border rounded-xl focus:outline-none focus:border-ocean"
      />
    </div>
  );
}
