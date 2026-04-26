import type { Metadata } from "next";
import "@/index.css";

export const metadata: Metadata = {
  title: "JunkGenie",
  description: "Turn your junk into something magical.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
