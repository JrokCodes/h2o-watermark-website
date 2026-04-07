import Hero from "../components/home/Hero";
import FeaturedRentals from "../components/home/FeaturedRentals";
import WhyChooseUs from "../components/home/WhyChooseUs";
import AreasWeServe from "../components/home/AreasWeServe";
import AboutTeaser from "../components/home/AboutTeaser";
import Testimonials from "../components/home/Testimonials";
import ContactCTA from "../components/home/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedRentals />
      <WhyChooseUs />
      <AreasWeServe />
      <AboutTeaser />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
