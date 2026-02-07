import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <ToastContainer position='top-right' autoClose={3000} />
        </AuthProvider>
      </body>
    </html>
  );
}
