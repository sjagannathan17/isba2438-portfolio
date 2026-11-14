import { Suspense } from "react";
import { Caveat, Cormorant_Garamond, Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import WatercolorDefs from "@/components/WatercolorDefs";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500"],
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
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${caveat.variable}`}>
      <body>
        <WatercolorDefs />
        <Suspense>
          <NavBar />
        </Suspense>
        <main className="page">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
