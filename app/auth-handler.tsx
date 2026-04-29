"use client";

import { useAuth } from "@/contexts/auth-context";

export function AuthHandler({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Loading dashboard…</h2>
        <p style={{ color: "#666", marginTop: 8 }}>
          Waiting for authentication...
        </p>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "red" }}>
        <h2>Unauthorized</h2>
        <p>No authentication token received.</p>
        <p>Please log in again from the Webflow app.</p>
      </div>
    );
  }

  return <>{children}</>;
}
