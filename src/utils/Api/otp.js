import api from "./index";

/* ================= MOBILE OTP (INSTITUTE USER) ================= */

/**
 * Send OTP to institute user's mobile
 * Backend expects: { onboarding_user_id }
 */
export const sendMobileOtp = (onboarding_user_id) => {
  return api.post("/send-otp", {
    onboarding_user_id,
  });
};

/**
 * Verify mobile OTP
 * Backend expects: { onboarding_user_id, otp }
 */
export const verifyMobileOtp = ({ onboarding_user_id, otp }) => {
  return api.post("/verify-otp", {
    onboarding_user_id,
    otp,
  });
};

/* ================= COLLEGE OTP (EXISTING COLLEGE FLOW) ================= */

/**
 * Send OTP to existing college TPO
 * Backend expects: { onboarding_user_id, college_id }
 */
export const sendCollegeOtp = ({ onboarding_user_id, college_id }) => {
  return api.post("/send-college-otp", {
    onboarding_user_id,
    college_id,
  });
};

/**
 * Verify college OTP
 * Backend expects: { ups_college_onboarding_id, college_verification_otp }
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
