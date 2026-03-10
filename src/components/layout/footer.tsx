import Link from "next/link";
import { Compass, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors mb-4">
              <Compass className="h-6 w-6" />
              <span>TravelXP</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Discover and share amazing travel experiences around the world. 
              Connect with travelers and create unforgettable memories.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-600 transition-colors hover:scale-110 transform duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-600 transition-colors hover:scale-110 transform duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-600 transition-colors hover:scale-110 transform duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  All Experiences
                </Link>
              </li>
              <li>
                <Link href="/#experiences" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/listings/create" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Host an Experience
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} TravelXP. Built with{" "}
            <span className="text-red-500 animate-pulse">❤️</span> using Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
