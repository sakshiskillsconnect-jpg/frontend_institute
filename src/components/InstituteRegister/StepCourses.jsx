"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// UI
import Select from "@/components/Ui/Select";
import Button from "@/components/Ui/Buttons/Button";
import Checkbox from "@/components/Ui/Inputs/Checkbox";
import { validateCoursesForm } from "@/utils/validateForm";

// API
import {
  saveOnboardingCourseSpecialization,
  submitInstituteOnboarding,
} from "@/utils/Api/onboarding";

import { getCourses, getSpecializations } from "@/utils/Api/course";

// CONTEXT
import { useInstituteContext } from "@/context/InstituteContext";

const StepCourses = ({ onNext, onBack }) => {
  const { account } = useInstituteContext();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [specSearch, setSpecSearch] = useState("");
  const [errors, setErrors] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);

  const [rows, setRows] = useState([
    {
      courseId: "",
      specializationIds: [],
      availableSpecializations: [],
    },
  ]);

  /* -------------------- LOAD COURSES -------------------- */
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data || []);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  /* -------------------- HANDLERS -------------------- */

  const handleCourseChange = async (index, courseId) => {
    try {
      const numericCourseId = Number(courseId);
      const res = await getSpecializations(numericCourseId);

      setRows((prev) =>
        prev.map((row, i) =>
          i === index
            ? {
                courseId,
                specializationIds: [],
                availableSpecializations: res.data || [],
              }
            : row
        )
      );
    } catch {
      toast.error("Failed to load specializations");
    }
  };

  const handleSpecializationToggle = (index, specId) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              specializationIds: row.specializationIds.includes(specId)
                ? row.specializationIds.filter((id) => id !== specId)
                : [...row.specializationIds, specId],
            }
          : row
      )
    );
  };

  const addMoreCourse = () => {
    setRows((prev) => [
      ...prev,
      {
        courseId: "",
        specializationIds: [],
        availableSpecializations: [],
      },
    ]);
  };

  /* -------------------- SAVE -------------------- */

  const handleSaveNext = async () => {
    setSubmitClicked(true);
    const validationErrors = validateCoursesForm(rows);

    const hasErrors = validationErrors.some(
      (err) => Object.keys(err).length > 0
    );

    if (hasErrors) {
      setErrors(validationErrors); // 🔴 show red UI
      return; // ⛔ stop submit
    }

    setErrors([]);
    setLoading(true);
    // const newErrors = rows.map((row) => {
    //   const rowErrors = {};

    //   if (!row.courseId) {
    //     rowErrors.courseId = "Please select a course";
    //   }

    //   if (!row.specializationIds || row.specializationIds.length === 0) {
    //     rowErrors.specializations = "Please select at least one specialization";
    //   }

    //   return rowErrors;
    // });

    // const hasErrors = newErrors.some(
    //   (err) => Object.keys(err).length > 0
    // );

    // if (hasErrors) {
    //   setErrors(newErrors); // 🔴 SHOW ERRORS
    //   return; // ⛔ STOP SUBMIT
    // }

    // // ✅ CLEAR ERRORS BEFORE API CALL
    // setErrors([]);
    setLoading(true);
    try {
      setLoading(true);

      if (!account?.onboardingUserId) {
        toast.error("Onboarding user id missing");
        return;
      }

      for (const row of rows) {
        if (!row.courseId || row.specializationIds.length === 0) {
          toast.error("Please select course & specializations");
          return;
        }

        for (const specId of row.specializationIds) {
          await saveOnboardingCourseSpecialization({
            ups_college_onboarding_id: account.onboardingUserId,
            course_id: Number(row.courseId),
            specialization_id: Number(specId),
          });
        }
      }

      await submitInstituteOnboarding({
        ups_college_onboarding_id: account.onboardingUserId,
      });

      onNext();
    } catch (err) {
      console.error("COURSE SAVE ERROR:", err);
      toast.error(err?.response?.data?.msg || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Courses & Specializations</h3>

      {rows.map((row, index) => (
        <div key={index} className="mb-6 border p-4 rounded">
          {/* ---------- COURSE SELECT ---------- */}
          <Select
            label="Select Course"
            required
            searchable
            options={[
              { label: "Select", value: "" },
              ...courses.map((c) => ({
                label: c.course_name || c.name,
                value: c.id,
              })),
            ]}
            value={row.courseId}
            onChange={(e) => handleCourseChange(index, e.target.value)}
            className={errors[index]?.courseId ? "border-red-500" : ""}
          />
          {submitClicked && errors[index]?.courseId && (
            <p className="text-red-500 text-sm mt-1">
              {errors[index].courseId}
            </p>
          )}

          {/* ---------- SPECIALIZATIONS BOX ---------- */}
          {row.courseId && (
            //<div className="mt-4 border rounded-md bg-gray-50">
            <div
              className={`mt-4 border rounded-md bg-gray-50 ${
                submitClicked && errors[index]?.specializations
                  ? "border-red-500"
                  : ""
              }`}
            >
              {/* SEARCH INPUT (NOT DROPDOWN) */}
              <div className="p-3 border-b bg-white">
                <input
                  type="text"
                  placeholder="Search specializations"
                  value={specSearch}
                  onChange={(e) => setSpecSearch(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {/* CHECKBOX LIST – FIXED HEIGHT + SCROLL */}
              <div
                className="p-3 overflow-y-auto"
                style={{ maxHeight: "260px" }}
              >
                {row.availableSpecializations
                  .filter((spec) =>
                    (spec.specilization_name || spec.name)
                      .toLowerCase()
                      .includes(specSearch.toLowerCase())
                  )
                  .map((spec) => (
                    <Checkbox
                      key={spec.id}
                      label={spec.specilization_name || spec.name}
                      checked={row.specializationIds.includes(spec.id)}
                      onChange={() =>
                        handleSpecializationToggle(index, spec.id)
                      }
                    />
                  ))}

                {row.availableSpecializations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No specializations found
                  </p>
                )}
              </div>
            </div>
          )}
          {submitClicked && errors[index]?.specializations && (
            <p className="text-red-500 text-sm mt-1">
              {errors[index].specializations}
            </p>
          )}
        </div>
      ))}

      {/* ADD MORE COURSE */}
      <Button variant="secondary" onClick={addMoreCourse}>
        + Add another course
      </Button>

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>

        <Button loading={loading} onClick={handleSaveNext}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default StepCourses;
