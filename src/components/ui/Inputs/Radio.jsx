"use client";

const Radio = ({ name, label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="accent-teal-600"
      />
      {label}
    </label>
  );
};

export default Radio;
