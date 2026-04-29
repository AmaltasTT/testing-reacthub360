"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let tokenReceived = false;

    console.log("Requesting fresh auth token from parent...");
    window.parent.postMessage("iframe-ready", "*");

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "auth") {
        const receivedToken = event.data.token;

        if (receivedToken) {
          console.log("Received fresh auth token from parent");
          tokenReceived = true;
          setToken(receivedToken);
          setIsLoading(false);

          // Store fresh token in all locations
          document.cookie = `auth_token=${receivedToken}; path=/; max-age=86400; SameSite=Lax`;
          localStorage.setItem("auth_token", receivedToken);
          sessionStorage.setItem("auth_token", receivedToken);

          router.refresh();
        } else {
          console.error("Received auth message but no token");
          setError(true);
          setIsLoading(false);
        }
      }
    };

    window.addEventListener("message", handler);

    const timeout = setTimeout(() => {
      if (!tokenReceived) {
        const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN;

        if (devToken) {
          console.log(
            "No token received from parent, using dev token for local development"
          );
          setToken(devToken);
          setIsLoading(false);
          localStorage.setItem("auth_token", devToken);
          sessionStorage.setItem("auth_token", devToken);
        } else {
          console.error(
            "Timeout: No auth token received from parent and no dev token available"
          );
          setError(true);
          setIsLoading(false);
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener("message", handler);
      clearTimeout(timeout);
    };
  }, [router]);

  const value = {
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
