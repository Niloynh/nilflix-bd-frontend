import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import BottomNav from "@/components/BottomNav"; // <-- BottomNav এখানে ইমপোর্ট করুন

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NilFLix BD",
  description: "Your all-in-one entertainment hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider> {/* <-- AuthProvider এখানে শুরু করুন */}
          <main className="pb-20">{children}</main> {/* main-এ padding যোগ করুন */}
          <BottomNav /> {/* <-- BottomNav-কে Provider-এর ভেতরে আনুন */}
        </AuthProvider> {/* <-- AuthProvider এখানে শেষ করুন */}
      </body>
    </html>
  );
}