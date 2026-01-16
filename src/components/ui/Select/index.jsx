"use client";

import React from "react";
import ReactSelect from "react-select";

const Select = ({
  label,
  required,
  value,
  options = [],
  onChange,
  error,
  disabled = false,
  placeholder = "Please select",
  searchable = false, // 👈 NEW PROP
}) => {
  // react-select expects { label, value }
  const selectedOption =
    options.find((opt) => String(opt.value) === String(value)) || null;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {searchable ? (
        <ReactSelect
          value={selectedOption}
          options={options}
          onChange={(opt) => onChange({ target: { value: opt?.value || "" } })}
          isSearchable
          isDisabled={disabled}
          placeholder={placeholder}
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
              ...base,
              borderColor: error ? "#ef4444" : base.borderColor,
              boxShadow: "none",
              "&:hover": {
                borderColor: error ? "#ef4444" : base.borderColor,
              },
            }),
          }}
        />
      ) : (
        <select
          value={value}
          disabled={disabled}
          onChange={onChange}
          className={`rounded border px-3 py-2 text-sm outline-none
            ${error ? "border-red-500" : "border-gray-300"}
          `}
        >
          <option value="" disabled hidden>
            Please select
          </option>

          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default Select;
