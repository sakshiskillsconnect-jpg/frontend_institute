// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// // UI components
// import Button from "@/components/Ui/Buttons/Button";

// // API
// //import { submitInstituteOnboarding } from "@/utils/Api/onboarding";

// // CONTEXT
// import { useInstituteContext } from "@/context/InstituteContext";

// const StepReview = ({ onBack }) => {
//   const router = useRouter();

//   const {
//     account,
//     college,
//     collegeInfo,
//     courses,
//     resetInstituteContext
//   } = useInstituteContext();

//   const [loading, setLoading] = useState(false);

//   /* -------------------- SUBMIT -------------------- */

//   const handleSubmit = async () => {
//     if (!account?.onboardingUserId) {
//       alert("Onboarding user ID missing");
//       return;
//     }

//     if (!college?.upsCollegeOnboardingId) {
//       alert("College onboarding ID missing");
//       return;
//     }

//     try {
//       setLoading(true);

//       // 🔑 BACKEND-EXPECTED PAYLOAD ONLY
//       await submitInstituteOnboarding({
//         onboarding_user_id: account.onboardingUserId,
//         ups_college_onboarding_id: college.upsCollegeOnboardingId
//       });

//       // ✅ Clear context
//       resetInstituteContext();

//       // ✅ Redirect
//       router.push("/dashboard");
//     } catch (err) {
//       console.error("FINAL SUBMIT ERROR:", err);
//       alert(
//         err.response?.data?.msg ||
//           "Failed to submit registration"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------------------- UI -------------------- */

//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-4">
//         Review & Submit
//       </h3>

//       {/* ACCOUNT DETAILS */}
//       <Section title="Account Details">
//         <Item label="Register By" value={account?.registerBy} />
//         <Item label="Name" value={account?.name} />
//         <Item label="Official Email" value={account?.officialEmail} />
//         <Item label="Mobile" value={account?.mobile} />
//         <Item label="College Name" value={account?.collegeName} />
//       </Section>

//       {/* COLLEGE INFO */}
//       <Section title="College Information">
//         <Item label="Institute Name" value={collegeInfo?.instituteName} />
//         <Item label="City" value={collegeInfo?.city} />
//         <Item label="State" value={collegeInfo?.state} />
//         <Item label="NAAC Grade" value={collegeInfo?.naacGrade} />
//       </Section>

//       {/* COURSES */}
//       <Section title="Courses & Specializations">
//         {courses?.length ? (
//           courses.map((row, index) => (
//             <div key={index} className="mb-2">
//               <p className="text-sm">
//                 Course ID: {row.courseId}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Specializations:{" "}
//                 {row.specializationIds.join(", ")}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-sm text-gray-500">
//             No courses added
//           </p>
//         )}
//       </Section>

//       {/* ACTION BUTTONS */}
//       <div className="mt-6 flex justify-between">
//         <Button variant="secondary" onClick={onBack}>
//           Back
//         </Button>

//         <Button loading={loading} onClick={handleSubmit}>
//           Submit Registration
//         </Button>
//       </div>
//     </div>
//   );
// };

// /* ---------------- Reusable Components ---------------- */

// const Section = ({ title, children }) => (
//   <div className="mb-6 border rounded p-4">
//     <h4 className="font-semibold mb-3">{title}</h4>
//     {children}
//   </div>
// );

// const Item = ({ label, value }) => (
//   <p className="text-sm mb-1">
//     <span className="font-medium">{label}:</span>{" "}
//     {value || "-"}
//   </p>
// );

// export default StepReview;
