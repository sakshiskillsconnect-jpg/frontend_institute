"use client";

import InstituteRegister from "@/components/InstituteRegister/InstituteRegister";
import { InstituteProvider } from "@/context/InstituteContext";

export default function Page() {
  return (
    <InstituteProvider>
      <InstituteRegister />
    </InstituteProvider>
  );
}
