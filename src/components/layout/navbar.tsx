"use client";

import Link from "next/link";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Compass, Menu, Plus, X} from "lucide-react";
import {useSession, signOut} from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    const {data: session, status} = useSession();
    const isAuthenticated = status === "authenticated";
    const userName = session?.user?.name || "User";

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/"
                          className="flex items-center space-x-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition-all hover:scale-105">
                        <Compass className="h-6 w-6"/>
                        <span className="hidden sm:inline">TravelXP</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
                        >
                            Explore
                        </Link>
                        {isAuthenticated && (
                            <Link
                                href="/dashboard"
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
                            >
                                My Listings
                            </Link>
                        )}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Button asChild size="sm"
                                        className="gap-2 hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg">
                                    <Link href="/listings/create">
                                        <Plus className="h-4 w-4"/>
                                        Create Listing
                                    </Link>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm"
                                                className="hover:scale-105 transition-transform duration-200">
                                            {userName}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" className="cursor-pointer w-full">
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/listings/create" className="cursor-pointer w-full">
                                                Create Listing
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem
                                            onClick={() => signOut({callbackUrl: "/"})}
                                            className="cursor-pointer text-red-600"
                                        >
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="outline" size="sm"
                                        className="hover:scale-105 transition-transform duration-200">
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild size="sm"
                                        className="hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg">
                                    <Link href="/register">Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all hover:scale-110"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6 transition-transform duration-200"/>
                        ) : (
                            <Menu className="h-6 w-6 transition-transform duration-200"/>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-white/95 backdrop-blur-md animate-fade-in">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            href="/"
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Explore
                        </Link>
                        {isAuthenticated && (
                            <Link
                                href="/dashboard"
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                My Listings
                            </Link>
                        )}
                        <div className="pt-3 border-t space-y-2">
                            {isAuthenticated ? (
                                <>
                                    <Button asChild className="w-full gap-2 shadow-md hover:shadow-lg" size="sm">
                                        <Link href="/listings/create" onClick={() => setMobileMenuOpen(false)}>
                                            <Plus className="h-4 w-4"/>
                                            Create Listing
                                        </Link>
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full" size="sm">
                                                {userName}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="cursor-pointer w-full"
                                                      onClick={() => setMobileMenuOpen(false)}>
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/listings/create" className="cursor-pointer w-full"
                                                      onClick={() => setMobileMenuOpen(false)}>
                                                    Create Listing
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setMobileMenuOpen(false);
                                                    signOut({callbackUrl: "/"});
                                                }}
                                                className="cursor-pointer text-red-600"
                                            >
                                                Logout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <>
                                    <Button asChild variant="outline"
                                            className="w-full hover:scale-105 transition-transform duration-200"
                                            size="sm">
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                            Login
                                        </Link>
                                    </Button>
                                    <Button asChild
                                            className="w-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                                            size="sm">
                                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                            Sign Up
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
