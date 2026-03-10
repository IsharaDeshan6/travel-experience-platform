"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: {
    name?: string;
    email: string;
    password: string;
  }) => {
    // TODO: Implement actual registration logic in Phase 7
    console.log("Register data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For now, just redirect to login
    alert("Registration functionality will be implemented in Phase 7 (Backend). For now, redirecting to login.");
    router.push("/login");
  };

  return <AuthForm mode="register" onSubmit={handleRegister} />;
}
