import api from "./index";

/* ================= COLLEGE ONBOARDING APIS ================= */

/**
 * Search existing colleges based on onboarding user
 * Backend: POST /get-college-list
 */
export const getCollegeList = ({ onboarding_user_id }) => {
  return api.post("/get-college-list", {
    onboarding_user_id,
  });
};

/**
 * Send OTP to existing college TPO
 * Backend: POST /send-college-otp
 */
export const sendCollegeOtp = ({ onboarding_user_id, college_id }) => {
  return api.post("/send-college-otp", {
    onboarding_user_id,
    college_id,
  });
};

/**
 * Verify college OTP
 * Backend: POST /verify-college-otp
 */
export const verifyCollegeOtp = ({
  ups_college_onboarding_id,
  college_verification_otp,
}) => {
  return api.post("/verify-college-otp", {
    ups_college_onboarding_id,
    college_verification_otp,
  });
};

/**
 * Save manual college details (when no existing college found)
 * Backend: POST /College-form
 */
export const saveManualCollegeDetails = (payload) => {
  return api.post("/College-form", payload);
};
