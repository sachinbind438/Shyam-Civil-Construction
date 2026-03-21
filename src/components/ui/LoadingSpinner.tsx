interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
  className = ""
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const colors = {
    primary: "border-[#C9A96E]",
    white: "border-white",
    gray: "border-gray-400"
  };

  return (
    <div
      className={`
        ${sizes[size]}
        ${colors[color]}
        border-2 border-t-transparent rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
