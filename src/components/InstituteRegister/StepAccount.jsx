"use client";

import { useState } from "react";
import toast from "react-hot-toast";
//import { validateForm } from "@/utils/validateForm";

// UI
import Input from "@/components/Ui/Inputs/Input";
import Select from "@/components/Ui/Select";
import Button from "@/components/Ui/Buttons/Button";
import Checkbox from "@/components/Ui/Inputs/Checkbox";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
// API
import {
  instituteRegistrationStepOne,
  sendMobileOtp,
} from "@/utils/Api/onboarding";

// Context
import { useInstituteContext } from "@/context/InstituteContext";

/* ---------------- OPTIONS ---------------- */

const registerByOptions = [
  //{ label: "Please select", value: "", disabled: true },
  { label: "College TPO", value: "College TPO" },
  { label: "Principal", value: "Principal" },
  { label: "Dean", value: "Dean" },
  { label: "Student Coordinator", value: "College Student Coordinator" },
];

const instituteTypeOptions = [
  //{ label: "Please select", value: "", disabled: true },
  { label: "College", value: "College" },
  { label: "Global", value: "Global" },
  { label: "Deemed", value: "Deemed" },
  { label: "State Run", value: "State Run" },
  { label: "IIT", value: "IIT" },
];

/* ---------------- COMPONENT ---------------- */

const StepAccount = ({ onRegistered }) => {
  const { setAccount } = useInstituteContext();

  const [form, setForm] = useState({
    registerBy: "",
    instituteType: "",
    name: "",
    officialEmail: "",
    personalEmail: "",
    mobile: "",
    password: "",
    collegeName: "",
    acceptTerms: false,

    tpoName: "",
    tpoEmail: "",
    tpoMobile: "",
    tpoPassword: "",
  });

  // 🔥 single toggle state
  const [showTpoFields, setShowTpoFields] = useState(false);
  const [showTpoPassword, setShowTpoPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitClicked, setSubmitClicked] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const isCollegeTpo = form.registerBy === "College TPO";

  const clearTpo = () => {
    handleChange("tpoName", "");
    handleChange("tpoEmail", "");
    handleChange("tpoMobile", "");
    handleChange("password", "");
  };

  const validateForm = () => {
    const newErrors = {};

    // always required
    const baseRequired = ["registerBy", "instituteType", "collegeName"];

    baseRequired.forEach((field) => {
      if (!form[field]?.toString().trim()) {
        newErrors[field] = "This field is required";
      }
    });

    // non-college TPO fields
    if (!isCollegeTpo) {
      ["name", "officialEmail", "mobile", "password"].forEach((field) => {
        if (!form[field]?.toString().trim()) {
          newErrors[field] = "This field is required";
        }
      });
    }

    // TPO fields
    if (isCollegeTpo || showTpoFields) {
      ["tpoName", "tpoEmail", "tpoMobile", "password"].forEach((field) => {
        if (!form[field]?.toString().trim()) {
          newErrors[field] = "This field is required";
        }
      });
    }

    // if (!form.acceptTerms) {
    //   toast.error("Please accept terms and conditions");
    //   return false;
    // }

    setErrors(newErrors);

    // if (Object.keys(newErrors).length > 0) {
    //   toast.error("Please fill all required fields");
    //   return false;
    // }

    return true;
  };

  /* ---------------- REGISTER ---------------- */

  const handleRegister = async () => {
    //if (!validateForm()) return;
    setSubmitClicked(true);
    const validationErrors = validateForm(form);

    const { acceptTerms, ...rest } = form;

    const hasAnyValue = Object.values(rest).some(
      (val) => val && val.toString().trim() !== ""
    );

    // 1️⃣ User clicked register with everything empty
    // if (!hasAnyValue) {
    //   setErrors(validationErrors);
    //   toast.error("Please fill all required fields");
    //   return;
    // }
    if (!hasAnyValue) {
     setSubmitClicked(true); // ✅ push ALL errors at once
      return; // ❌ stop submit
    }

    // 1️⃣ Field validation first
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted errors");
      return;
    }

    // 2️⃣ Terms validation after
    if (!form.acceptTerms) {
      toast.error("Please accept terms and conditions");
      return;
    }

    // 3️⃣ All good → submit
    setErrors({});
    try {
      setLoading(true);

      const payload = {
        ...form,
        hasTpo: !isCollegeTpo && showTpoFields,
      };
      console.log("Register payload password:", form.password);

      const res = await instituteRegistrationStepOne(payload);
      const id = res?.data?.data?.onboarding_user_id;

      if (!id) throw new Error("onboarding_user_id missing");

      await sendMobileOtp(id);

      setAccount({
        ...payload,
        onboardingUserId: id,
      });
      toast.success("OTP sent successfully");

      onRegistered({
        account: payload,
        onboardingUserId: id,
      });
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* BASIC INFO */}
      <div className="flex flex-col">
        <Select
          label="Register by"
          required
          options={registerByOptions}
          value={form.registerBy}
          onChange={(e) => {
            const value = e.target.value;
            handleChange("registerBy", value);

            if (value === "College TPO") {
              setShowTpoFields(false);
              clearTpo();
            }
          }}
          className={errors.registerBy ? "border-red-500" : ""}
        />
        {errors.registerBy && (
          <p className="text-red-500 text-sm mt-1">{errors.registerBy}</p>
        )}
      </div>

      <div className="flex flex-col">
        <Select
          label="Institute Type"
          required
          options={instituteTypeOptions}
          value={form.instituteType}
          onChange={(e) => handleChange("instituteType", e.target.value)}
          className={errors.instituteType ? "border-red-500" : ""}
        />
        {errors.instituteType && (
          <p className="text-red-500 text-sm mt-1">{errors.instituteType}</p>
        )}
      </div>

      {/* ---------- NON COLLEGE TPO FIELDS ---------- */}
      {!isCollegeTpo && (
        <>
          <div className="flex flex-col">
            <Input
              label="Name"
              required
              value={form.name}
              placeholder="Enter Name"
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {submitClicked && errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col">
            <Input
              label="Official email"
              required
              value={form.officialEmail}
              placeholder="Enter Official Email"
              onChange={(e) => handleChange("officialEmail", e.target.value)}
              className={errors.officialEmail ? "border-red-500" : ""}
            />
            {errors.officialEmail && (
              <p className="text-red-500 text-sm">{errors.officialEmail}</p>
            )}
          </div>

          <Input
            label="Personal email"
            value={form.personalEmail}
            placeholder="Enter Personal Email"
            onChange={(e) => handleChange("personalEmail", e.target.value)}
          />

          <div className="flex flex-col">
            <Input
              label="Mobile"
              required
              helperText="OTP Required"
              value={form.mobile}
              placeholder="Enter Valid Number"
              onChange={(e) => handleChange("mobile", e.target.value)}
              className={errors.mobile ? "border-red-500" : ""}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Input
              label="Create Password"
              type="password"
              required
              value={form.password}
              placeholder="Enter Password"
              onChange={(e) => handleChange("password", e.target.value)}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
        </>
      )}

      {/* ---------- COLLEGE NAME (ALWAYS) ---------- */}
      <div className="flex flex-col">
        <Input
          label="College name"
          required
          value={form.collegeName}
          placeholder="Enter College Name"
          onChange={(e) => handleChange("collegeName", e.target.value)}
          className={errors.collegeName ? "border-red-500" : ""}
        />
        {errors.collegeName && (
          <p className="text-red-500 text-sm">{errors.collegeName}</p>
        )}
      </div>

      {/* ---------- ADD / REMOVE TPO BUTTON ---------- */}
      {!isCollegeTpo && (
        <div className="col-span-1 md:col-span-2 pt-2">
          {!showTpoFields ? (
            <Button
              type="button"
              className="bg-green-600 text-white"
              onClick={() => setShowTpoFields(true)}
            >
              Add TPO
            </Button>
          ) : (
            <Button
              type="button"
              variant="danger"
              className="bg-red-500 text-white"
              onClick={() => {
                setShowTpoFields(false);
                clearTpo();
              }}
            >
              Remove TPO
            </Button>
          )}
        </div>
      )}

      {/* ---------- TPO FIELDS ---------- */}
      {(isCollegeTpo || showTpoFields) && (
        <>
          <div className="flex flex-col">
            <Input
              label="TPO name"
              required
              value={form.tpoName}
              placeholder="Enter TPO Name"
              onChange={(e) => handleChange("tpoName", e.target.value)}
              className={errors.tpoName ? "border-red-500" : ""}
            />
            {errors.tpoName && (
              <p className="text-red-500 text-sm">{errors.tpoName}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Input
              label="TPO number"
              required
              helperText="OTP Required"
              value={form.tpoMobile}
              placeholder="Enter Phone Number"
              onChange={(e) => handleChange("tpoMobile", e.target.value)}
              className={errors.tpoMobile ? "border-red-500" : ""}
            />
            {errors.tpoMobile && (
              <p className="text-red-500 text-sm">{errors.tpoMobile}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Input
              label="TPO email"
              required
              value={form.tpoEmail}
              placeholder="Enter TPO Official Email"
              onChange={(e) => handleChange("tpoEmail", e.target.value)}
              className={errors.tpoEmail ? "border-red-500" : ""}
            />
            {errors.tpoEmail && (
              <p className="text-red-500 text-sm">{errors.tpoEmail}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Input
              label="Create password"
              required
              type={showTpoPassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              //onChange={(e) => handleChange("tpoPassword", e.target.value)}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowTpoPassword(!showTpoPassword)}
                  className="text-gray-500"
                >
                  {showTpoPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              }
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
        </>
      )}

      {/* TERMS */}
      <div className="col-span-1 md:col-span-2">
        <Checkbox
          checked={form.acceptTerms}
          onChange={(e) => handleChange("acceptTerms", e.target.checked)}
          label="To continue, please accept the terms and conditions"
        />
      </div>

      {/* SUBMIT */}
      <div className="col-span-1 md:col-span-2 pt-2">
        <Button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className="bg-[#0b6627] text-white"
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </div>
    </div>
  );
};

export default StepAccount;
