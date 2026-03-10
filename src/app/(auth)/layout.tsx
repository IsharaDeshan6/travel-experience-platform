import Link from "next/link";
import { Compass } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 mb-8 text-blue-600 hover:text-blue-700 transition"
        >
          <Compass className="h-8 w-8" />
          <span className="text-2xl font-bold">TravelXP</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
