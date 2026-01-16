import api from "./index";

/* ================= STEP 1 : INSTITUTE REGISTRATION ================= */
export const instituteRegistrationStepOne = (form) =>
  api.post("/register/step-one", {
    register_by: form.registerBy,
    institute_type: form.instituteType,
    name: form.name,
    personal_email: form.personalEmail || null,
    official_email: form.officialEmail,
    mobile_number: form.mobile,
    password: form.password,
    college_name: form.collegeName,
    tpo_name: form.tpoName,
    tpo_email: form.tpoEmail,
    tpo_mobile: form.tpoMobile,
  });

/* ================= ADD TPO DETAILS ================= */
export const addTpoDetails = (data) =>
  api.post("/add-tpo", {
    onboarding_user_id: data.onboardingUserId,
    tpo_name: data.tpoName,
    tpo_email: data.tpoEmail,
    tpo_mobile: data.tpoMobile,
    tpo_password: data.tpoPassword,
  });

/* ================= OTP ================= */
export const sendMobileOtp = (onboarding_user_id) =>
  api.post("/send-otp", { onboarding_user_id });

 export const verifyOtp = (data) => api.post("/verify-otp", data);

export const resendInstituteOtp = (data) => {
  api.post("/resend-otp", data);
};
/* ================= COLLEGE SELECTION ================= */
export const getCollegeListing = (payload) =>
  api.post("/get-college-list", payload);

export const sendCollegeOtp = (payload) =>
  api.post("/send-college-otp", payload);

export const verifyCollegeOtp = (payload) =>
  api.post("/verify-college-otp", payload);

export const resendCollegeOtp = (payload) => {
  api.post("/resend-college-otp", payload);
};

export const getCollegeDetails = (payload) =>
  api.post("/college-profile-data", payload);

/* ================= MANUAL COLLEGE ================= */
export const saveManualCollegeDetails = (payload) =>
  api.post("/College-form", payload);

/* ================= COURSES ================= */
export const saveOnboardingCourseSpecialization = (payload) =>
  api.post("/saveOnboardingCourseSpecialization", payload);

export const getOnboardingAddedCourses = (payload) =>
  api.post("/getOnboardingAddedCourses", payload);

/* ================= FINAL SUBMIT ================= */
export const submitInstituteOnboarding = (payload) =>
  api.post("/submit", payload);

export const getStates = async () => {
  const response = api.get("/states");
  const states = (await response).data;
  return states;
  console.log(JSON.stringify(states));
};

export const getCities = async (cityId) => {
  const response = api.get(`/city/${cityId}`);
  const city = (await response).data;
  return city;
};
