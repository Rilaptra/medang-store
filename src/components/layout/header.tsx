"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, Sun, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useTheme from "next-theme";
import { FaRegistered, FaSignInAlt, FaUser } from "react-icons/fa";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log(session?.user);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Medang Store
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="hover:text-primary line-through">
              Products
            </Link>
            <Link href="/sellers" className="hover:text-primary line-through">
              Sellers
            </Link>
            {session?.user ? (
              <>
                <Link href="/cart">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        className="w-full h-full"
                        href={`/${session.user.username}`}
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="w-full h-full" href="/orders">
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    {session.user?.role === "admin" && (
                      <DropdownMenuItem>
                        <Link className="w-full h-full" href="/admin/user">
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() =>
                        signOut({ callbackUrl: window.location.origin })
                      }
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  {theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Link className="w-full h-full" href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link className="w-full h-full" href="/auth/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link href="/products" className="block py-2 w-full h-full">
              Products
            </Link>
            {session?.user.role !== "seller" && (
              <Link href="/sellers" className="block py-2 w-full h-full">
                Sellers
              </Link>
            )}
            {session?.user ? (
              <>
                <Link href="/cart" className="block py-2 w-full h-full">
                  Cart
                </Link>
                <Link
                  href={`/${session.user.username}`}
                  className="block py-2 w-full h-full"
                >
                  Profile
                </Link>
                <Link href="/orders" className="block py-2 w-full h-full">
                  Orders
                </Link>
                {session.user.role === "admin" && (
                  <Link href="/admin/user" className="block py-2 w-full h-full">
                    Admin Panel
                  </Link>
                )}
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => {
                    signOut();
                    toast.success("Logout successful");
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-5">
                <Link href="/auth/signin" className="w-full">
                  <Button variant="secondary" className="w-full flex gap-2">
                    <FaSignInAlt />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" className="w-full">
                  <Button className="w-full flex gap-2">
                    <FaUser />
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-center"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <>
                  <Moon className="h-5 w-5 mr-2" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5 mr-2" />
                  Light Mode
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
