"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Ui/Buttons/Button";
import { useInstituteContext } from "@/context/InstituteContext";
import { getCollegeListing } from "@/utils/Api/onboarding";

const StepCollege = ({ onNext, onBack, onOtpRequired }) => {
  const { account, setCollege } = useInstituteContext();

  const [colleges, setColleges] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState(null);
  const [notListed, setNotListed] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH COLLEGES ---------------- */
  useEffect(() => {
    if (account?.collegeName) {
      fetchSimilarColleges(account.collegeName);
    }
  }, [account?.collegeName]);

  const fetchSimilarColleges = async (collegeName) => {
    try {
      setLoading(true);

      const res = await getCollegeListing({
        college_name: collegeName,
      });

      if (res?.data?.status && Array.isArray(res.data.data)) {
        setColleges(res.data.data);
        setNotListed(false);
      } else {
        setColleges([]);
        setNotListed(true);
      }
    } catch (err) {
      console.error("College lookup failed", err);
      setColleges([]);
      setNotListed(true);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- NEXT ---------------- */
  const handleNext = async () => {
    if (!notListed && !selectedCollegeId) {
      alert("Please select a college");
      return;
    }

    /* ===== EXISTING COLLEGE ===== */
    if (!notListed) {
      const selectedCollege = colleges.find((c) => c.id === selectedCollegeId);

      if (!selectedCollege) {
        alert("Selected college not found");
        return;
      }

      // ✅ SAVE BASE INFO IN CONTEXT
      setCollege({
        collegeId: selectedCollege.id,
        collegeData: null, // will be filled after OTP / prefill API
        verificationStatus: selectedCollege.verification_status,
        notListed: false,
      });

      // ✅ VERIFIED → OTP REQUIRED
      const status = (selectedCollege.verification_status || "")
        .toLowerCase()
        .trim();
        console.log("College status:", selectedCollege.verification_status);

      if (status === "verified") {
        onOtpRequired({
          collegeId: selectedCollege.id,
          college_name: selectedCollege.college_name,
        });
        return;
      }

      // ❌ NOT VERIFIED → DIRECT PREFILL
      onNext({
        collegeId: selectedCollege.id,
      });
      return;
    }

    /* ===== MANUAL COLLEGE ===== */
    setCollege({
      collegeId: null,
      collegeData: {},
      notListed: true,
    });

    onNext(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">College Selection</h2>
      <p className="text-gray-500 mb-4">Select or confirm your college</p>

      {loading ? (
        <p>Checking similar colleges...</p>
      ) : colleges.length > 0 ? (
        <div
          className=" max-h-[420px]
      overflow-y-auto
      border
      border-gray-300
      rounded-lg
      p-3
      space-y-3
      bg-white"
        >
          <p className="font-medium">
            Similar colleges found, please select your college.
          </p>

          {colleges.map((college) => (
            <label
              key={college.id}
              className={`flex gap-3 p-3 border rounded cursor-pointer ${
                selectedCollegeId === college.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="college"
                checked={selectedCollegeId === college.id}
                onChange={() => {
                  setSelectedCollegeId(college.id);
                  setNotListed(false);
                }}
              />

              <div>
                <p className="font-medium">{college.college_name}</p>
                <p className="text-sm text-gray-500">
                  Status: {college.verification_status || "—"}
                </p>
              </div>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No similar colleges found.</p>
      )}

      <div className="text-center my-4 font-semibold">OR</div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={notListed}
          onChange={(e) => {
            setNotListed(e.target.checked);
            setSelectedCollegeId(null);
          }}
        />
        My College / Institute is not listed
      </label>

      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>

        <Button onClick={handleNext} disabled={loading}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepCollege;
