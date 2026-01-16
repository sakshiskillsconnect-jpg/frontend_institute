"use client";

import {
  BuildingLibraryIcon,
  LockClosedIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const steps = [
  { id: 1, icon: BuildingLibraryIcon, label: "Registration" },
  { id: 2, icon: LockClosedIcon, label: "Verify OTP" },
  { id: 3, icon: AcademicCapIcon, label: "Select College" },
  { id: 4, icon: DocumentTextIcon, label: "College Info" },
  { id: 5, icon: ClipboardDocumentListIcon, label: "Courses" },
  { id: 6, icon: CheckCircleIcon, label: "Review" },
];

const Stepper = ({ currentStep }) => {
  return (
    <div className="h-full flex justify-center">
      <div className="flex flex-col h-full py-6">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = index === steps.length - 1;
          const Icon = isCompleted ? CheckCircleIcon : step.icon;

          return (
            <div key={step.id} className="flex gap-4 min-h-[90px]">
              {/* LEFT SIDE */}
              <div className="flex flex-col items-center">
                
                {/* CIRCLE */}
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full
                    ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-black text-white"
                        : "border border-gray-300 text-gray-400"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* LINE */}
                {!isLast && (
                  <div
                    className={`w-[2px] flex-1 mt-1
                      ${
                        isCompleted
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }
                    `}
                  />
                )}
              </div>

              {/* RIGHT TEXT */}
              <div className="pt-1">
                <p
                  className={`text-sm font-medium
                    ${
                      isCompleted || isActive
                        ? "text-black"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
