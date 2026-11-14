import { Suspense } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Suspense>
          <NavBar />
        </Suspense>
        <main className="page">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
