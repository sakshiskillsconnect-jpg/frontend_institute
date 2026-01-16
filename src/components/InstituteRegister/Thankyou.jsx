"use client";

const ThankYou = ({ onHome }) => {
  return (
    <div className="w-full flex justify-center items-center py-16">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md px-8 py-12 text-center">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Thank You !
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Your college registration process has been completed successfully!
        </p>

        {/* Home Button */}
        <button
          onClick={onHome}
          className="inline-flex items-center justify-center
                     bg-teal-700 hover:bg-teal-800
                     text-white font-medium
                     px-8 py-3 rounded-full
                     transition"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
