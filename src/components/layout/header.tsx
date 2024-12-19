"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            SchoolMarket
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            <Link href="/sellers" className="hover:text-primary">
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
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/orders">Orders</Link>
                    </DropdownMenuItem>
                    {session.user?.role === "admin" && (
                      <DropdownMenuItem>
                        <Link href="/admin/user">Admin Panel</Link>
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
              </>
            ) : (
              <div className="space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
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
            <Link href="/products" className="block py-2">
              Products
            </Link>
            <Link href="/sellers" className="block py-2">
              Sellers
            </Link>
            {session?.user ? (
              <>
                <Link href="/cart" className="block py-2">
                  Cart
                </Link>
                <Link href="/profile" className="block py-2">
                  Profile
                </Link>
                <Link href="/orders" className="block py-2">
                  Orders
                </Link>
                {/* {session.user.role === 'admin' && (
                  <Link href="/admin" className="block py-2">
                    Admin Panel
                  </Link>
                )} */}
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
