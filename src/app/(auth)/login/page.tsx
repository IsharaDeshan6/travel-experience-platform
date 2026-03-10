"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: {
    email: string;
    password: string;
  }) => {
    // TODO: Implement actual login logic in Phase 8
    console.log("Login data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For now, just redirect to home
    alert("Login functionality will be implemented in Phase 8 (Authentication)");
    router.push("/");
  };

  return <AuthForm mode="login" onSubmit={handleLogin} />;
}
