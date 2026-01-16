const StepHeader = ({ step, title, description }) => {
  return (
    <div className="mb-8">
      <span className="inline-block mb-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
        Step {step} of 4
      </span>

      <h1 className="text-2xl font-semibold text-black">
        {title}
      </h1>

      <p className="text-gray-500 mt-1">
        {description}
      </p>
    </div>
  );
};

export default StepHeader;
