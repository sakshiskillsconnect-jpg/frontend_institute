import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#ebf6f7] flex justify-center items-start ">
          <div className="min-h-screenb  w-full px-2 py-10">
            {children}
            <Toaster position="top-right" />
          </div>
        </div>
      </body>
    </html>
  );
}

import { Toaster } from "react-hot-toast";
