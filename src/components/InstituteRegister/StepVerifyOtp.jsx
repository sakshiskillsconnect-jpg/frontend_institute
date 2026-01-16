"use client";

import { useEffect, useState, useRef } from "react";
import Button from "@/components/Ui/Buttons/Button";
import { useInstituteContext } from "@/context/InstituteContext";
import {
  verifyOtp,
  verifyCollegeOtp,
  resendCollegeOtp,
  resendInstituteOtp,   // ✅ MISSING IMPORT (FIXED)
  sendCollegeOtp,
} from "@/utils/Api/onboarding";

/* Mask mobile like 098xxxxxx78 */
const maskMobile = (mobile = "") => {
  if (!mobile || mobile.length < 4) return mobile;
  return `${mobile.slice(0, 3)}xxxxxx${mobile.slice(-2)}`;
};

const StepVerifyOtp = ({
  mode = "register", // "register" | "college"
  college,
  onNext,
  onBack,
}) => {
  const { account } = useInstituteContext();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);
  const otpSentRef = useRef(false);

  const otpValue = otp.join("");

  /* ================= SEND OTP ON LOAD (COLLEGE ONLY) ================= */
  useEffect(() => {
    otpSentRef.current = false;
  }, [mode]);

  useEffect(() => {
    if (
      mode === "college" &&
      college?.college_name &&
      !otpSentRef.current
    ) {
      otpSentRef.current = true;

      sendCollegeOtp({
        college_name: college.college_name,
      });
    }
  }, [mode, college?.college_name]);

  /* ================= RESET OTP WHEN MODE CHANGES ================= */
  useEffect(() => {
    setOtp(["", "", "", ""]);
    setTimer(30);
    setCanResend(false);
  }, [mode]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ================= OTP INPUT ================= */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    if (otpValue.length !== 4) {
      alert("Please enter 4 digit OTP");
      return;
    }

    try {
      setLoading(true);

      /* ===== REGISTER OTP ===== */
      if (mode === "register") {
        if (!account?.onboardingUserId) {
          alert("Onboarding ID missing. Please restart registration.");
          return;
        }

        await verifyOtp({
          onboarding_user_id: account.onboardingUserId,
          otp: Number(otpValue),
        });
      }

      /* ===== COLLEGE OTP ===== */
      if (mode === "college") {
        if (!college?.college_name) {
          alert("College data missing");
          return;
        }

        await verifyCollegeOtp({
          college_name: college.college_name,
          college_verification_otp: Number(otpValue),
        });
      }

      onNext(); // ✅ SUCCESS
    } catch (err) {
      console.error("OTP VERIFY ERROR:", err);
      alert(
        err?.response?.data?.msg ||
          err?.response?.data?.message ||
          "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResend = async () => {
    try {
      setCanResend(false);
      setTimer(30);
      setOtp(["", "", "", ""]);
      inputsRef.current[0]?.focus();

      /* ===== REGISTER RESEND ===== */
      if (mode === "register") {
        if (!account?.onboardingUserId) {
          alert("Onboarding ID missing");
          return;
        }

        await resendInstituteOtp({
          onboarding_user_id: account.onboardingUserId,
        });
      }

      /* ===== COLLEGE RESEND ===== */
      if (mode === "college") {
        await resendCollegeOtp({
          college_name: college.college_name,
        });
      }
    } catch (err) {
      console.error("RESEND OTP ERROR:", err);
      alert("Failed to resend OTP");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md text-center space-y-6">
        <h2 className="text-2xl font-semibold">OTP Verification</h2>

        {/* REGISTER OTP INFO */}
        {mode === "register" && (
          <div className="space-y-1">
            <p className="text-lg font-medium">
              Hello,{" "}
              <span className="text-teal-700">
                {account?.name || "User"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              OTP sent on{" "}
              <span className="text-green-600 font-medium">
                {maskMobile(account?.mobile)}
              </span>
            </p>
          </div>
        )}

        {/* OTP INPUTS */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            onClick={onBack}
            className="bg-gray-200 text-gray-700 px-6"
          >
            Back
          </Button>

          <Button
            onClick={handleVerifyOtp}
            disabled={loading || otpValue.length !== 4}
            className="!bg-teal-700 !text-white px-6"
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </div>

        {/* TIMER / RESEND */}
        <div className="text-sm text-gray-600">
          {!canResend ? (
            <p>
              OTP Sent 00:
              {timer.toString().padStart(2, "0")}
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-teal-700 font-medium hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepVerifyOtp;
