import Button from "../button/button";


export default function CTA() {
return (
    <section className="text-center">
        <h2 className="text-5xl font-semibold mb-6">Ready to Transform Your Space?</h2> 
        <p className="text-lg text-gray-600 mb-8">Contact us today for a free consultation and let’s bring your vision to life!</p>
        <   Button href="/contact" text="Get a Free Estimate" />
    </section>
)
}