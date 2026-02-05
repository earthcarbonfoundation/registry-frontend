import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import SignInPage from "./signin/page";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}

          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            async
            defer
          ></script>
        </AuthProvider>
      </body>
    </html>
  );
}
