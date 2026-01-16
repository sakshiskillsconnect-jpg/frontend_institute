export const validateForm = (form, stateId, cityId) => {
  const errors = {};

  if (!form.registerBy) errors.registerBy = "This field is required";
  if (!form.instituteType) errors.instituteType = "This field is required";
  if (!form.name) errors.name = "This field is required";
  if (!form.officialEmail) errors.officialEmail = "This field is required";
  if (!form.mobile) errors.mobile = "This field is required";
  if (!form.password) errors.password = "This field is required";
  if (!form.collegeName) errors.collegeName = "This field is required";

  if (showTpoFields) {
    if (!form.tpoName) errors.tpoName = "TPO name is required";
    if (!form.tpoEmail) errors.tpoEmail = "TPO email is required";
  }

  if (!form.instituteName?.trim())
    errors.instituteName = "This field is required";
  if (!form.shortName?.trim()) errors.shortName = "This field is required";
  if (!form.address?.trim()) errors.address = "This field is required";
  if (!form.stateId) errors.stateId = "This field is required";
  if (!form.cityId) errors.cityId = "This field is required";
  if (!form.pincode?.trim()) errors.pincode = "This field is required";
  if (!form.website?.trim()) errors.website = "This field is required";

  // // Institute Name
  // if (!String(form.instituteName || "").trim()) {
  //   errors.instituteName = "This field is required";
  // }

  // // Short Name
  // if (!String(form.shortName || "").trim()) {
  //   errors.shortName = "This field is required";
  // }

  // // Address
  // if (!String(form.address || "").trim()) {
  //   errors.address = "This field is required";
  // }

  // // State
  // if (!stateId) {
  //   errors.stateId = "This field is required";
  // }

  // // City
  // if (!cityId) {
  //   errors.cityId = "This field is required";
  // }

  // // Pincode
  // if (!String(form.pincode || "").trim()) {
  //   errors.pincode = "This field is required";
  // }

  // // Website
  // if (!String(form.website || "").trim()) {
  //   errors.website = "This field is required";
  // }

  // ❌ DO NOT validate acceptTerms here
  // return errors;


};
export const validateCoursesForm = (rows = []) => {
  const errors = [];

  rows.forEach((row, index) => {
    const rowErrors = {};

    if (!row.courseId) {
      rowErrors.courseId = "Please select a course";
    }

    if (!row.specializationIds || row.specializationIds.length === 0) {
      rowErrors.specializations =
        "Please select at least one specialization";
    }

    errors[index] = rowErrors;
  });

  return errors;
};

