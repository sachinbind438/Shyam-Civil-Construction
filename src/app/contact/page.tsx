import Button from "../../components/button/button";
export default function ContactPage() {
  return (
    <section className="px-6 lg:px-18 pt-48 pb-6">
      {/* Top heading */}
      <div className="mb-20 gap-6 flex flex-col">
        <h1 className="text-8xl lg:text-7xl font-medium ">
          Do You have a Dream Project?
        </h1>
        <p className="text-lg font-medium text-gray-600 max-w-2xl text-[18px]!  ">
          Write to us by completing the form. We will get back to you as soon as possible!
        </p>
        <p className="text-red-600! font-medium text-[18px]! ">
          Accepting projects only in Mumbai Region
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[600px_1fr] gap-24">
        {/* LEFT — Sticky Contact Details */}
        <div className="sticky top-24 self-start font-medium">
          <h2 className="text-5xl text-start! font-medium mb-8">Contact Details</h2>

          <p className="text-gray-700 leading-relaxed text-[20px]! mb-8">
            D1, First Floor, Akurli Samata CHS LTD,<br />
            Road No RSC 1, Akurli Road, Near Fast Food<br />
            Center, Kandivali (E)- Mumbai 400101
          </p>

          <p className="mb-6 text-[20px]!">Shyamcivilconstruction@gmail.com</p>
          <p className="mb-16 text-[20px]! font-medium">+91 9324508485 / 9324455382</p>

          <h3 className="text-4xl font-medium text-start! mb-8">Book a Call</h3>

          <p className="text-sm mb-4">Find Us On:</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>Facebook</span>
            <span>Instagram</span>
            <span>LinkedIn</span>
          </div>
        </div>

        {/* RIGHT — Scrollable Inquiry Form */}
        <div>
          <h2 className="text-4xl font-medium text-start! mb-12">Inquiry Formular</h2>

          {/* PERSONAL INFO */}
          <div className="mb-14">
            <h4 className="text-sm font-medium text-start! mb-6">PERSONAL INFO</h4>

            <label className="block mb-2 text-sm">Name *</label>
            <input
              className="w-full border border-gray-200 px-4 py-3 mb-6"
              placeholder="Name"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm">Email *</label>
                <input
                  className="w-full border border-gray-200 px-4 py-3"
                  placeholder="email@gmail.com"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Phone</label>
                <input
                  className="w-full border border-gray-200 px-4 py-3"
                  placeholder="+91 922 333 444"
                />
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="mb-14">
            <h4 className="text-sm font-medium text-start! mb-6">TIMELINE</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                className="border border-gray-200 px-4 py-3"
                placeholder="dd-mm-yyyy"
              />
              <input
                className="border border-gray-200 px-4 py-3"
                placeholder="dd-mm-yyyy"
              />
            </div>
          </div>

          {/* CONTACT PREFERENCES */}
          <div className="mb-14">
            <h4 className="text-sm font-medium text-start! mb-6">CONTACT PREFERENCES</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select className="border border-gray-200 px-4 py-3">
                <option>Email</option>
                <option>Phone</option>
              </select>

              <select className="border border-gray-200 px-4 py-3">
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
          </div>

          {/* TERMS */}
          <div className="flex items-center gap-3 mb-12 justify-between">
            <div className=" flex items-center gap-3">
            <input type="checkbox" className="scale-130" />
            <span className="text-sm">I agree with Terms & Conditions</span>
            </div>
            {/* SUBMIT */}
          <Button
            href="#"
            text="Submit Inquiry"
            variant="dark"
            size="lg"
          />
          </div>

          
        </div>
      </div>
    </section>
  );
}
