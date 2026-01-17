"use client";

import SidebarStepper from "./SidebarStepper";

const InstituteLayout = ({ sidebarStep, children }) => {
  return (
    <div className="px-2 lg:px-6 pt-0 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-6">
          <h1 className="text-lg lg:text-3xl md:text-2xl font-bold text-[#005e6a]">
            College / Educational Institution Registration
          </h1>
          <p className="mt-1 text-sm md:text-base text-gray-600">
            This registration is only for college staff members.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-y-4 lg:gap-8">
          {/* LEFT SIDEBAR */}
          <div className="col-span-12 lg:col-span-3 ">
            <div className="bg-white rounded-xl border border-gray-200 shadow lg:p-6 p-2 h-full">
              {/* ✅ USE sidebarStep */}
              {/* <SidebarStepper currentStep={sidebarStep} /> */}
              <SidebarStepper
                currentStep={sidebarStep}
                isThankYou={sidebarStep === 4}
              />
            </div>
          </div>

          {/* RIGHT MAIN FORM */}
          <main className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-xl border border-gray-200 shadow p-5 lg:p-8 h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InstituteLayout;
