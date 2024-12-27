"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  Menu,
  Sun,
  Moon,
  House,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useTheme from "next-theme";
import { FaSignInAlt, FaUser } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b fixed top-0 left-0 right-0 z-[1] bg-background">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="text-2xl font-bold flex gap-2 items-center">
            <Button variant="link" size="icon">
              <House className="h-5 w-5" />{" "}
            </Button>
            <span className="hidden sm:inline-block whitespace-nowrap">
              Medang Market
            </span>
          </Link>

          <Card className="w-full shadow-none border-none">
            <Label htmlFor="search" className="flex items-center px-3 gap-2">
              <Search className="h-5 w-5" />
              <input
                type="text"
                id="search"
                name="search"
                className="flex h-10 w-full rounded-md text-sm outline-none"
                placeholder="Cari..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    const query = (
                      event.target as HTMLInputElement
                    ).value.trim();
                    if (query) {
                      router.push(`/?search=${encodeURIComponent(query)}`);
                    }
                  }
                }}
              />
            </Label>
          </Card>

          <div className="hidden md:flex md:gap-6 items-center">
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
                        className="w-full h-full flex flex-col"
                        href={`/${session.user.username}`}
                      >
                        <span>Profile</span>
                        <span className="opacity-75 text-xs">
                          @{session.user.username}
                        </span>
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
                      className="cursor-pointer"
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
              <div className="flex gap-2">
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
