
"use client";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  helperText = "",
  error = "",          // ✅ NEW
  rightIcon = null,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
    w-full rounded
    border px-3 py-2 text-sm
    text-black placeholder-gray-400
    ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
    border-gray-300
    focus:outline-none
    focus:ring-0 focus:ring-gray-400
    focus:border-gray-400
  `}
      />

      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

export default Input;
