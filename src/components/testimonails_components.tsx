import Button from "./button/button";
import TestimonialCard from "./Cards/TestimonialCard";

export default function TestimonialsSection() {
  return (
    <div className="py-12 px-6 flex flex-col items-center gap-8">
      <div className="text-center text-7xl font-raleway!">
        <h4>Our Clients' Experience</h4>
      </div>

      <div className="w-full justify-center flex flex-col gap-8">
        <div className="overflow-x-auto p-6">
          <div className="flex  items-center justify-between px-6">
            <TestimonialCard
              quote={`Shyam Civil Construction delivered high-quality interior work with professionalism and attention to detail. The project was completed on time, within budget, and exceeded my expectations.`}
              author="Bhavika Mehta"
            />

            <TestimonialCard
              quote={`Shyam Civil Construction exceeded my expectations with my renovation. Their professionalism, attention to detail, and commitment to quality ensured the project was completed on time. Highly recommended.`}
              author="Prem Chavan"
            />

            <TestimonialCard
              quote={`Beautiful work! The design matched our vision perfectly and the whole process was smooth. We love our new space! The team was professional, creative, and easy to work with.`}
              author="Aarti Sharma"
            />
          </div>
        </div>
        <Button
          className="self-center"
          href="/testimonials"
          text="Read More Reviews"
          variant="dark"
          size="lg"
          
        />
      </div>
    </div>
  );
}
