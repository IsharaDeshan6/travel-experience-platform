"use client";

import React, {useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Compass, Loader2} from "lucide-react";
import {signIn} from "next-auth/react";

interface AuthFormProps {
    mode: "login" | "register";
}

export function AuthForm({mode}: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === "register") {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    })
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Failed to create account");
                }

                const signInResult = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (signInResult?.error) {
                    throw new Error("Account created but failed to sign in");
                }

                window.location.href = "/";

            } else {
                const result = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });
                if (result?.error) {
                    throw new Error("Invalid email or password");
                }

                window.location.href = "/";
            }
        } catch (error) {
            console.error("Auth error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <Card className="w-full shadow-xl">
            <CardHeader className="space-y-3 text-center">
                <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Compass className="h-6 w-6 text-white"/>
                </div>
                <CardTitle className="text-2xl">
                    {mode === "login" ? "Welcome back" : "Create your account"}
                </CardTitle>
                <CardDescription>
                    {mode === "login"
                        ? "Enter your credentials to access your account"
                        : "Start sharing your travel experiences with the world"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "register" && (
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                autoComplete="name"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            minLength={8}
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                        />
                        {mode === "register" && (
                            <p className="text-xs text-gray-500">
                                Must be at least 8 characters long
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                {mode === "login" ? "Signing in..." : "Creating account..."}
                            </>
                        ) : mode === "login" ? (
                            "Sign In"
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    {mode === "login" ? (
                        <p className="text-gray-600">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-blue-600 hover:text-blue-700"
                            >
                                Sign up
                            </Link>
                        </p>
                    ) : (
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-blue-600 hover:text-blue-700"
                            >
                                Sign in
                            </Link>
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
