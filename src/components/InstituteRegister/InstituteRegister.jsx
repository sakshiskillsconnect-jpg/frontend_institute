"use client";

import { useState, useEffect } from "react";

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
import { STEPS } from "@/constants/steps";

const STORAGE_KEY = "instituteOnboardingProgress";

const InstituteRegister = () => {
  const { setCollege } = useInstituteContext();

  /* -------------------- CORE STATE -------------------- */
  const [currentStep, setCurrentStep] = useState(null); // ⛔ start null
  const [hydrated, setHydrated] = useState(false);

  const [otpMode, setOtpMode] = useState("register");
  //const [showThankYou, setShowThankYou] = useState(false);

  const [formData, setFormData] = useState({
    account: {},
    onboardingUserId: null,
    college: {},
    collegeInfo: {},
    courses: [],
  });

  /* -------------------- RESTORE (RUNS FIRST) -------------------- */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setCurrentStep(STEPS.REGISTRATION);
      setHydrated(true);
      return;
    }

    const parsed = JSON.parse(saved);
    let stepToRestore = parsed.currentStep;

    // 🚫 NEVER resume OTP
    if (stepToRestore === STEPS.OTP) {
      if (
        parsed.formData?.college &&
        Object.keys(parsed.formData.college).length
      ) {
        stepToRestore = STEPS.COLLEGE_INFO;
      } else {
        stepToRestore = STEPS.REGISTRATION;
      }
    }

    setCurrentStep(stepToRestore);
    setFormData(parsed.formData || {});
    setOtpMode(parsed.otpMode || "register");
    //setShowThankYou(parsed.showThankYou || false);

    setHydrated(true);
  }, []);

  /* -------------------- SAVE (AFTER HYDRATION ONLY) -------------------- */
  useEffect(() => {
    if (!hydrated || currentStep === null) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentStep,
        formData,
        otpMode,
        // showThankYou,
      })
    );
  }, [hydrated, currentStep, formData, otpMode]);

  /* -------------------- CLEAR AFTER THANK YOU -------------------- */
  useEffect(() => {
    if (currentStep === STEPS.THANK_YOU) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentStep]);

  /* -------------------- STEP HANDLERS -------------------- */

  const handleRegisterSuccess = ({ account, onboardingUserId }) => {
    setFormData((p) => ({ ...p, account, onboardingUserId }));
    setOtpMode("register");
    setCurrentStep(STEPS.OTP);
  };

  const fetchCollegePrefill = async (collegeId) => {
    const res = await getCollegeDetails({ college_id: collegeId });

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
          state_id: d.state_id ? String(d.state_id) : "",
          city_id: d.city_id ? String(d.city_id) : "",
        },
      }));
    }
  };

  const handleGoHome = () => {
    setCurrentStep(STEPS.REGISTRATION);
    setOtpMode("register");
    //setShowThankYou(false);
    setFormData({
      account: {},
      onboardingUserId: null,
      college: {},
      collegeInfo: {},
      courses: [],
    });
  };

  /* -------------------- SIDEBAR STEP -------------------- */
  const sidebarStep = (() => {
    if (currentStep === STEPS.REGISTRATION || currentStep === STEPS.OTP)
      return 1;
    if (currentStep === STEPS.COLLEGE_SELECT) return 2;
    if (currentStep === STEPS.COLLEGE_INFO) return 3;
    if (currentStep === STEPS.COURSES || currentStep === STEPS.THANK_YOU)
      return 4;
    return 1;
  })();

  /* -------------------- GUARD -------------------- */
  if (!hydrated || currentStep === null) {
    return null; // or loader
  }

  /* -------------------- UI -------------------- */
  return (
    <InstituteLayout sidebarStep={sidebarStep}>
      {/* STEP 1 */}
      {currentStep === STEPS.REGISTRATION && (
        <>
          <StepHeader step={1} title="Register" />
          <StepAccount onRegistered={handleRegisterSuccess} />
        </>
      )}

      {/* STEP 2 */}
      {currentStep === STEPS.OTP && (
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
            onBack={() =>
              setCurrentStep(
                otpMode === "register"
                  ? STEPS.REGISTRATION
                  : STEPS.COLLEGE_SELECT
              )
            }
            onNext={() => {
              if (otpMode === "register") {
                setCurrentStep(STEPS.COLLEGE_SELECT);
              } else {
                setCurrentStep(STEPS.COLLEGE_INFO);
              }
            }}
          />
        </>
      )}

      {/* STEP 3 */}
      {currentStep === STEPS.COLLEGE_SELECT && (
        <>
          <StepHeader step={2} title="Select College" />
          <StepSimilarCollege
            onBack={() => setCurrentStep(STEPS.REGISTRATION)}
            onNext={async (college) => {
              if (college?.collegeId) {
                await fetchCollegePrefill(college.collegeId);
              }
              setCurrentStep(STEPS.COLLEGE_INFO);
            }}
            onOtpRequired={(college) => {
              setFormData((p) => ({ ...p, college }));
              setOtpMode("college");
              setCurrentStep(STEPS.OTP);
            }}
          />
        </>
      )}

      {/* STEP 4 */}
      {currentStep === STEPS.COLLEGE_INFO && (
        <>
          <StepHeader step={3} title="College Info" />
          <StepCollegeInfo
            onNext={() => setCurrentStep(STEPS.COURSES)}
            onBack={() => setCurrentStep(STEPS.COLLEGE_SELECT)}
          />
        </>
      )}

      {/* STEP 5 */}
      {currentStep === STEPS.COURSES && (
        <>
          <StepHeader step={4} title="Courses" />
          <StepCourses
            // onNext={() => {
            //   //setShowThankYou(true);
            //   setCurrentStep(STEPS.THANK_YOU);
            // }}
            onNext={() => {
              // 👇 force sidebar to complete step 4 first
              setCurrentStep(STEPS.COURSES);

              // 👇 then move to thank you (next render)
              setTimeout(() => {
                setCurrentStep(STEPS.THANK_YOU);
              }, 0);
            }}
            onBack={() => setCurrentStep(STEPS.COLLEGE_INFO)}
          />
        </>
      )}

      {/* STEP 6 */}
      {currentStep === STEPS.THANK_YOU && <ThankYou onHome={handleGoHome} />}
    </InstituteLayout>
  );
};

export default InstituteRegister;
