import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import AsideComponent from "./components/AsideComponent";
import ThemeRegistry from "./components/ThemeRegistry";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neso - Time Tracker",
  description: "Time tracker",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex">
        <ThemeRegistry>
          <AsideComponent />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}