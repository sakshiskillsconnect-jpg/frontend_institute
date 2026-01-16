"use client";

import SidebarStepper from "./SidebarStepper";

const InstituteLayout = ({ sidebarStep, children }) => {
  return (
    <div className="bg-[#91C6BC] px-6 pt-4 pb-10">
    
      <div className="mx-auto max-w-7xl">

        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            College / Educational Institution Registration
          </h1>
          <p className="mt-1 text-sm md:text-base text-white/90">
            This registration is only for college staff members.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 items-stretch">

          {/* LEFT SIDEBAR */}
          <aside className="col-span-12 lg:col-span-3 ">
            <div className="bg-white rounded-xl shadow p-6 h-full">
              {/* ✅ USE sidebarStep */}
              <SidebarStepper currentStep={sidebarStep} />
            </div>
          </aside>

          {/* RIGHT MAIN FORM */}
          <main className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-xl shadow p-8 h-full">

              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default InstituteLayout;

