"use client";

const variants = {
  primary: "bg-green-600 hover:bg-green-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  success: "bg-green-600 hover:bg-green-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white"
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-5 py-2 rounded-md text-sm font-medium transition
        ${variants[variant]}
        ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
