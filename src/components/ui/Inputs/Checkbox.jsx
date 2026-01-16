"use client";

const Checkbox = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 accent-blue-600"
      />

      <span className="text-sm text-gray-700">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;
