"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { validateCollegeForm } from "@/utils/validateForm";

// UI
import Input from "@/components/Ui/Inputs/Input";
import Select from "@/components/Ui/Select";
import Button from "@/components/Ui/Buttons/Button";

// API
import { saveManualCollegeDetails } from "@/utils/Api/onboarding";
import { getStates } from "@/utils/Api/onboarding";
import { getCities } from "@/utils/Api/onboarding";

// CONTEXT
import { useInstituteContext } from "@/context/InstituteContext";

/* -------------------- COMPONENT -------------------- */

const StepCollegeInfo = ({ onNext, onBack }) => {
  const { account, setCollegeInfo } = useInstituteContext();

  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const { college } = useInstituteContext();
  const [submitClicked, setSubmitClicked] = useState(false);

  const [form, setForm] = useState({
    instituteName: "",
    shortName: "",
    address: "",
    pincode: "",
    website: "",
    naacGrade: "",
    financialLiteracy: "Yes",
  });

  const [errors, setErrors] = useState({});

  /* -------------------- PREFILL -------------------- */
  useEffect(() => {
    if (college?.collegeData) {
      const d = college.collegeData;

      setForm({
        instituteName: d.college_name || "",
        shortName: d.college_short_name || "",
        address: d.college_address || "",
        pincode: d.pincode || "",
        website: d.website || "",
        naacGrade: d.naac || "",
        financialLiteracy: d.fl_pitch ?? "Yes",
      });

      setStateId(d.state_id ? String(d.state_id) : "");
      setCityId(d.city_id ? String(d.city_id) : "");
    }
  }, [college?.collegeData]);

  const [loading, setLoading] = useState(false);

  /* -------------------- FORM HANDLERS -------------------- */
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* -------------------- VALIDATION -------------------- */

  const validateCollegeForm = () => {
    const newErrors = {};

    if (!String(form.instituteName || "").trim())
      newErrors.instituteName = "This field is required";

    if (!String(form.shortName || "").trim())
      newErrors.shortName = "This field is required";

    if (!String(form.address || "").trim())
      newErrors.address = "This field is required";

    if (!stateId) newErrors.stateId = "This field is required";

    if (!cityId) newErrors.cityId = "This field is required";

    if (!String(form.pincode || "").trim())
      newErrors.pincode = "This field is required";

    if (!String(form.website || "").trim())
      newErrors.website = "This field is required";

    return newErrors;
  };

  /* -------------------- SAVE -------------------- */
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await getStates();
        setStates(res?.data || []);
      } catch (err) {
        console.error("Failed to load states", err);
        setStates([]);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!stateId) {
        setCities([]);
        return;
      }

      try {
        const res = await getCities(stateId);
        setCities(res.data || []);
      } catch (err) {
        console.error("Failed to load cities");
        setCities([]);
      }
    };
    fetchCities();
  }, [stateId]);

  /* -------------------- SAVE & NEXT -------------------- */
  const handleSaveNext = async () => {
    const validationErrors = validateCollegeForm(form, stateId, cityId);
    setSubmitClicked(true);

    const hasAnyValue =
      Object.values(form).some((v) => v && v.toString().trim() !== "") ||
      stateId ||
      cityId;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // ⛔ STOP navigation
    }

    // 1️⃣ All empty
    // if (!hasAnyValue) {
    //   setErrors(validationErrors);
    //   toast.error("Fill required college details");
    //   return;
    // }
    if (!hasAnyValue) {
      setSubmitClicked(true); // ✅ push ALL errors at once
      return; // ❌ stop submit
    }

    // // 2️⃣ Some invalid
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   toast.error("Please fix highlighted college errors");
    //   return;
    // }

    // // 3️⃣ Safety check
    // if (!account?.onboardingUserId) {
    //   toast.error("Onboarding user id missing");
    //   return;
    // }

    try {
      setLoading(true);

      const payload = {
        onboarding_user_id: account.onboardingUserId,
        college_name: form.instituteName,
        college_short_name: form.shortName,
        college_address: form.address,
        state_id: stateId,
        city_id: cityId,
        pincode: form.pincode,
        website: form.website,
        naac: form.naacGrade || null,
        fl_pitch: form.financialLiteracy,
      };

      await saveManualCollegeDetails(payload);
      setCollegeInfo(payload);
      onNext(); // ✅ COURSE PAGE WILL OPEN
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.msg || "Failed to save college information"
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Institute Name */}
      <Input
        label="Institute Name"
        required
        value={form.instituteName}
        error={errors.instituteName}
        onChange={(e) => handleChange("instituteName", e.target.value)}
        className={errors.instituteName ? "border-red-500" : ""}
      />
      {errors.instituteName && (
        <p className="text-red-500 text-sm">{errors.instituteName}</p>
      )}

      {/* Short Name */}
      <Input
        label="College Short Name"
        required
        value={form.shortName}
        error={errors.shortName}
        onChange={(e) => handleChange("shortName", e.target.value)}
        className={errors.shortName ? "border-red-500" : ""}
      />
      {errors.shortName && (
        <p className="text-red-500 text-sm">{errors.shortName}</p>
      )}

      {/* Address – FULL WIDTH ON DESKTOP */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>

        <textarea
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          rows={3}
          className={`w-full rounded border border-gray-300 px-3 py-2 text-sm
                 focus:outline-none focus:ring-1 focus:ring-gray-400 ${
                   errors.address ? "border-red-500" : "border-gray-300"
                 }`}
          placeholder="Enter address"
          required
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      {/* State */}
      <Select
        label="State"
        searchable
        value={String(stateId || "")}
        error={errors.stateId}
        onChange={(e) => {
          setStateId(e.target.value);
          setCityId(""); // reset city when state changes
        }}
        options={[
          { label: "Select State", value: "" },
          ...states.map((state) => ({
            label: state.name,
            value: state.id,
          })),
        ]}
      />

      {/* City */}
      <Select
        label="City"
        searchable
        value={String(cityId || "")}
        error={errors.cityId}
        onChange={(e) => setCityId(e.target.value)}
        disabled={!stateId}
        options={[
          { label: "Select City", value: "" },
          ...cities.map((city) => ({
            label: city.name,
            value: String(city.id),
          })),
        ]}
      />

      {/* Pincode */}
      <Input
        label="Pincode"
        required
        value={form.pincode}
        error={errors.pincode}
        onChange={(e) => handleChange("pincode", e.target.value)}
      />

      {/* Financial Literacy */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Are you interested in financial literacy?
        </label>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.financialLiteracy === "Yes"}
              onChange={() => handleChange("financialLiteracy", "Yes")}
            />
            Yes
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.financialLiteracy === "No"}
              onChange={() => handleChange("financialLiteracy", "No")}
            />
            No
          </label>
        </div>
      </div>

      {/* Website */}
      <Input
        label="College Website"
        required
        value={form.website}
        error={errors.website}
        placeholder="Enter official website"
        onChange={(e) => handleChange("website", e.target.value)}
        className={errors.website ? "border-red-500" : ""}
      />
      {errors.website && (
        <p className="text-red-500 text-sm">{errors.website}</p>
      )}

      {/* NAAC */}
      <Select
        label="NAAC Grades"
        options={[
          { label: "Please Select", value: "" },
          { label: "A++", value: "A++" },
          { label: "A+", value: "A+" },
          { label: "A", value: "A" },
          { label: "B++", value: "B++" },
          { label: "B+", value: "B+" },
        ]}
        value={form.naacGrade}
        onChange={(e) => handleChange("naacGrade", e.target.value)}
      />

      {/* ACTION BUTTONS – STACK ON MOBILE */}
      <div className="md:col-span-2 flex flex-col-reverse md:flex-row justify-between gap-4 mt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>

        <Button onClick={handleSaveNext} loading={loading}>
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default StepCollegeInfo;
