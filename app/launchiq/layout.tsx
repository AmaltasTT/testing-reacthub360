import type { Metadata } from "next";
import "./launchiq.css";

export const metadata: Metadata = {
  title: "LaunchIQ",
};

export default function LaunchIQLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="launchiq-root min-h-screen antialiased">
      {children}
    </div>
  );
}
