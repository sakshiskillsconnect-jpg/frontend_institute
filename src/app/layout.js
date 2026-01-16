import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#91C6BC] flex justify-center items-start py-10">
          <div className="min-h-screenb bg-[#91C6BC] w-full px-2 py-10">
            {children}
            <Toaster position="top-right" />
          </div>
        </div>
      </body>
    </html>
  );
}

import { Toaster } from "react-hot-toast";
