import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CRMApp from "@/components/crm-app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ENTRAIN CRM | Workspace",
  description: "ENTRAIN CRM — your growth, in focus.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CRMApp />
      </body>
    </html>
  );
}
