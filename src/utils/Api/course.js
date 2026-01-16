import api from "./index";

/* ================= COURSE MASTER (TEMP / MOCK) ================= */
export const getCourses = async () => {

  const response = api.get("/getCourses");
  const courses =  (await response).data;
  return courses;
  console.log(JSON.stringify(courses));
}



export const addTpoDetails = (data) =>
  api.post("/add-tpo", {
    onboarding_user_id: data.onboardingUserId,
    tpo_name: data.tpoName,
    tpo_email: data.tpoEmail,
    tpo_mobile: data.tpoMobile,
    tpo_password: data.tpoPassword
  });

export const getSpecializations = async (courseId) => {

  const response = api.get(`/getspecilization/${courseId}`);
  const courses =  (await response).data;
  return courses;
};

/* ================= ONBOARDING SAVE ================= */

/**
 * Save course + specialization
 * Backend: POST /saveOnboardingCourseSpecialization
 */
export const saveOnboardingCourseSpecialization = ({
  ups_college_onboarding_id,
  course_id,
  specialization_id
}) => {
  return api.post("/saveOnboardingCourseSpecialization", {
    ups_college_onboarding_id,
    course_id,
    specialization_id
  });
};

/**
 * Fetch already added onboarding courses
 * Backend: POST /getOnboardingAddedCourses
 */
export const getOnboardingAddedCourses = ({
  ups_college_onboarding_id
}) => {
  return api.post("/getOnboardingAddedCourses", {
    ups_college_onboarding_id
  });
};

