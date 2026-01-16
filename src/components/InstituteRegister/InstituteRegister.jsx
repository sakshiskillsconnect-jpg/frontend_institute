"use client";

import { useState } from "react";

import InstituteLayout from "./InstituteLayout";
import StepHeader from "./StepHeader";

import StepAccount from "./StepAccount";
import StepVerifyOtp from "./StepVerifyOtp";
import StepSimilarCollege from "./StepSimilarCollege";
import StepCollegeInfo from "./StepCollegeInfo";
import StepCourses from "./StepCourses";
import ThankYou from "./Thankyou";
import { getCollegeDetails } from "@/utils/Api/onboarding";

import { useInstituteContext } from "@/context/InstituteContext";

const InstituteRegister = () => {
  const { college } = useInstituteContext();
  const { setCollege } = useInstituteContext();
  const [currentStep, setCurrentStep] = useState(1);
  //const [otpSource, setOtpSource] = useState(null);
  // values: "REGISTER" | "COLLEGE"

  // 🔥 register | college
  const [otpMode, setOtpMode] = useState("register");
  const [showThankYou, setShowThankYou] = useState(false);

  const [formData, setFormData] = useState({
    account: {},
    onboardingUserId: null,
    college: {},
    collegeInfo: {},
    courses: [],
  });

  /* ================= STEP 1 → REGISTER ================= */

  const handleRegisterSuccess = ({ account, onboardingUserId }) => {
    setFormData((p) => ({
      ...p,
      account,
      onboardingUserId,
    }));

    setOtpMode("register");
    setCurrentStep(2); // 🔥 OPEN OTP
  };

  const fetchCollegePrefill = async (collegeId) => {
    const res = await getCollegeDetails({
      college_id: collegeId,
    });

    if (res?.data?.status) {
      const d = res.data.data;

      setCollege((prev) => ({
        ...prev,
        collegeData: {
          instituteName: d.college_name || "",
          shortName: d.college_short_name || "",
          address: d.college_address || "",
          website: d.website || "",
          pincode: d.pincode || "",
          naacGrade: d.naac || "",
          financialLiteracy: d.fl_pitch ? "Yes" : "No",

          // 👇 IMPORTANT for selects
          state_id: d.state_id ? String(d.state_id) : "",
          city_id: d.city_id ? String(d.city_id) : "",
        },
      }));
    }
  };

  const sidebarStep = (() => {
    if (currentStep === 1 || currentStep === 2) return 1; // Register + OTP
    if (currentStep === 3) return 2; // College selection + OTP
    if (currentStep === 4) return 3; // College info
    if (currentStep === 5 || currentStep === 6) return 4; // Courses + Thank You
    return 1;
  })();

  /* ================= Thankyouu redirection! ================= */

  const handleGoHome = () => {
    setCurrentStep(1);
    setOtpMode("register");
    setShowThankYou(false);

    setFormData({
      account: {},
      onboardingUserId: null,
      college: {},
      collegeInfo: {},
      courses: [],
    });
  };

  /* ================= UI ================= */

  return (
    <InstituteLayout sidebarStep={sidebarStep}>
      {/* STEP 1 : REGISTER */}
      {/* <div className="relative overflow-hidden">
        <div
          key={currentStep}
          className="animate-step transition-all duration-300 ease-out"
        > */}
          {currentStep === 1 && (
            <>
              <StepHeader step={1} title="Register" />
              <StepAccount onRegistered={handleRegisterSuccess} />
            </>
          )}
          {/* STEP 2 : OTP (REGISTER + COLLEGE) */}
          {currentStep === 2 && (
            <>
              <StepHeader
                step={otpMode === "register" ? 1 : 2}
                title="Verify OTP"
                description={
                  otpMode === "college"
                    ? "Verify OTP sent to registered college"
                    : "Verify your mobile number"
                }
              />

              <StepVerifyOtp
                mode={otpMode}
                college={formData.college}
                onBack={() => {
                  setCurrentStep(otpMode === "register" ? 1 : 3);
                }}
                onNext={async () => {
                  if (otpMode === "register") {
                    setCurrentStep(3); // after user OTP
                  } else {
                    const res = await getCollegeDetails({
                      college_id: formData.college.collegeId,
                    });

                    if (res?.data?.status) {
                      const d = res.data.data;

                      setCollege((prev) => ({
                        ...prev,
                        collegeData: {
                          instituteName: d.college_name || "",
                          shortName: d.college_short_name || "",
                          address: d.college_address || "",
                          website: d.website || "",
                          pincode: d.pincode || "",
                          naacGrade: d.naac || "",
                          financialLiteracy: d.fl_pitch ? "Yes" : "No",

                          // 👇 REQUIRED FOR DROPDOWNS
                          state_id: d.state_id ? String(d.state_id) : "",
                          city_id: d.city_id ? String(d.city_id) : "",
                        },
                      }));
                    }
                    setCurrentStep(4); // after college OTP
                  }
                }}
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <StepHeader step={2} title="Select College" />
              <StepSimilarCollege
                onBack={() => setCurrentStep(1)}
                onNext={async (college) => {
                  if (college?.collegeId) {
                    await fetchCollegePrefill(college.collegeId);
                  }

                  setCurrentStep(4);
                }}
                onOtpRequired={(college) => {
                  setFormData((p) => ({ ...p, college }));
                  setOtpMode("college");
                  setCurrentStep(2); // OTP opens immediately
                }}
              />
            </>
          )}
          {/* STEP 4 : COLLEGE INFO */}
          {currentStep === 4 && (
            <>
              <StepHeader step={3} title="College Info" />
              <StepCollegeInfo
                onNext={() => setCurrentStep(5)}
                onBack={() => setCurrentStep(3)}
              />
            </>
          )}
          {/* STEP 5 : COURSES */}
          {currentStep === 5 && (
            <>
              <StepHeader step={4} title="Courses" />
              <StepCourses
                onNext={() => {
                  setShowThankYou(true);
                  setCurrentStep(6);
                }} // ✅ FIX
                onBack={() => setCurrentStep(4)}
              />
            </>
          )}
          {/* STEP 6 : THANK YOU */}
          {currentStep === 6 && showThankYou && (
            <ThankYou onHome={handleGoHome} />
          )}
        {/* </div>
      </div> */}
      {/* ✅ FINAL PAGE */}
    </InstituteLayout>
  );
};

export default InstituteRegister;
