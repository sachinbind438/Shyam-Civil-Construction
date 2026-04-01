import Button from "../button/button";

export default function CTA() {
  return (
    <section className="text-center px-4 py-12 md:p-10 flex flex-col items-center gap-4 md:gap-5">

      <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl m-4 md:m-6 leading-tight">
        Ready to Transform Your Space?
      </h2>

      <p className="text-base px-10 sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-xl">
        Contact us today for a free consultation and let’s bring your vision
        to life!
      </p>

      <Button 
        href="/contact" 
        text="Get a Free Estimate" 
        size="md" 
      />
      
    </section>
  );
}