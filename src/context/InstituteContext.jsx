"use client";

import { createContext, useContext, useState } from "react";

const InstituteContext = createContext(null);

// 🔹 Initial states (single source of truth)
const initialAccountState = {};

const initialCollegeState = {
  // flow
  notListed: false,

  // college identification
  collegeId: null,          // ups_colleges_id
  collegeName: null,

  // verification
  verificationStatus: null, // Verified / Unverified
  otpVerified: false,

  // dependency
  onboardingUserId: null,
};

const initialCollegeInfoState = {};
const initialCoursesState = [];

export const InstituteProvider = ({ children }) => {
  // STEP-1
  const [account, setAccount] = useState(initialAccountState);

  // STEP-3
  const [college, setCollege] = useState(initialCollegeState);

  // STEP-4
  const [collegeInfo, setCollegeInfo] = useState(
    initialCollegeInfoState
  );

  // STEP-5
  const [courses, setCourses] = useState(initialCoursesState);

  // 🔹 Reset everything after final submit
  const resetInstituteContext = () => {
    setAccount(initialAccountState);
    setCollege(initialCollegeState);
    setCollegeInfo(initialCollegeInfoState);
    setCourses(initialCoursesState);
  };

  return (
    <InstituteContext.Provider
      value={{
        // data
        account,
        college,
        collegeInfo,
        courses,

        // setters
        setAccount,
        setCollege,
        setCollegeInfo,
        setCourses,

        // helpers
        resetInstituteContext,
      }}
    >
      {children}
    </InstituteContext.Provider>
  );
};

// 🔹 Safe custom hook
export const useInstituteContext = () => {
  const context = useContext(InstituteContext);
  if (!context) {
    throw new Error(
      "useInstituteContext must be used inside InstituteProvider"
    );
  }
  return context;
};
