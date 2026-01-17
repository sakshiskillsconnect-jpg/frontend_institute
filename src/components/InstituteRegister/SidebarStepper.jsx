"use client";

import {
  BuildingLibraryIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const steps = [
  {
    id: 1,
    title: "Registration",
    subtitle: "Institute Details",
    icon: BuildingLibraryIcon,
  },
  {
    id: 2,
    title: "Select College",
    subtitle: "College Existence",
    icon: AcademicCapIcon,
  },
  {
    id: 3,
    title: "College Info",
    subtitle: "Basic Information",
    icon: DocumentTextIcon,
  },
  {
    id: 4,
    title: "Courses",
    subtitle: "Courses & Specializations",
    icon: ClipboardDocumentListIcon,
  },
];

const SidebarStepper = ({ currentStep, isThankYou = false }) => {
  return (
    <>
      {/* ================= MOBILE STEPPER ================= */}
      <div className="lg:hidden bg-white px-4 py-3 rounded-xl w-full">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => {
            const isCompleted =
              step.id < currentStep ||
              (step.id === 4 && isThankYou);

            const isActive = step.id === currentStep;
            const Icon = isCompleted ? CheckCircleIcon : step.icon;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* CIRCLE */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-black text-white"
                        : "border border-gray-300 text-gray-400"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* LINE */}
                {index !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px]
                      ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center mt-2 text-gray-500">
          Step {currentStep} of {steps.length}
        </p>
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden lg:block bg-white rounded-xl p-6">
        <h3 className="text-sm font-semibold tracking-wide text-gray-600 mb-8">
          REGISTRATION PROGRESS
        </h3>

        <div className="flex flex-col gap-8">
          {steps.map((step, index) => {
  const isLast = index === steps.length - 1;

  const isCompleted =
    step.id < currentStep ||
    (step.id === 4 && isThankYou);

  const isActive = step.id === currentStep;
  const Icon = isCompleted ? CheckCircleIcon : step.icon;

  return (
    <div key={step.id} className="flex gap-4 h-[96px]">
      {/* ICON + LINE */}
      <div className="flex flex-col items-center">
        {/* CIRCLE */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
            ${
              isCompleted
                ? "bg-green-500 text-white"
                : isActive
                ? "bg-black text-white"
                : "border-2 border-gray-300 text-gray-400"
            }
          `}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* CONNECTOR LINE */}
        {!isLast && (
          <div
            className={`w-[2px] h-[56px]
              ${isCompleted ? "bg-green-500" : "bg-gray-200"}
            `}
          />
        )}
      </div>

      {/* TEXT */}
      <div className="pt-1">
        <p
          className={`font-medium ${
            isCompleted || isActive
              ? "text-gray-900"
              : "text-gray-400"
          }`}
        >
          {step.title}
        </p>
        <p className="text-sm text-gray-400">
          {step.subtitle}
        </p>
      </div>
    </div>
  );
})}

        </div>
      </div>
    </>
  );
};

export default SidebarStepper;

