import { Suspense } from "react";
import { Archivo, Geist } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RecruiterAssistant from "@/components/RecruiterAssistant";
import "./globals.css";

const geist = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Srinidhi Jagannathan",
    template: "%s | Srinidhi Jagannathan",
  },
  description:
    "Portfolio of Srinidhi Jagannathan, AI builder and product manager, MS Business Analytics at Santa Clara University.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} ${archivo.variable}`}>
      <body>
        <Suspense>
          <NavBar />
        </Suspense>
        <main className="page">{children}</main>
        <Footer />
        <RecruiterAssistant />
      </body>
    </html>
  );
}
