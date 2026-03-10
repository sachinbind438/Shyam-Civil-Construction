type TestimonialCardProps = {
  quote: string;
  author: string;
  role?: string;
  className?: string;
};

export default function TestimonialCard({
  quote,
  author,
  role = "Client Review",
  className = "",
}: TestimonialCardProps) {
  return (
    <div
      className={`relative items-center w-full max-w-[420px] min-h-80 bg-[#f6efe6] rounded-[72px] md:rounded-[72px] p-6 md:p-8 flex flex-col justify-between  overflow-hidden ${className}`}
    >
      {/* Quote */}
      <div className="mt-1 flex-1 flex items-center px-5">
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">{quote}</p>
      </div>

      {/* Author */}
      <div className="text-left mt-4">
        <div className="text-sm font-semibold text-gray-800">{author}</div>
        <div className="text-xs text-gray-500">{role}</div>
      </div>
    </div>
  );
}
