"use client";
import React, { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarIcon, PhoneIcon, UserIcon, VerifiedIcon } from "lucide-react";
import {
  FaExclamation,
  FaExclamationCircle,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import { IoMdLink } from "react-icons/io";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import ErrorDialog from "@/components/error-dialog";
import ProductCard from "@/components/seller-product-card";
import { AddProductDialog } from "@/components/add-product-dialog";
import EditProfilePage from "@/components/edit-profile";
import { roleBadgeColors } from "@/components/user-card";

import { IUser } from "@/lib/db/models/user.model";
import { IProduct } from "@/lib/db/models/product.model";
import useTheme from "next-theme";

// --- Helper Functions ---
const userRoleBadge = (user: IUser) => {
  if (!user.role) {
    return null;
  }
  const roleColors = roleBadgeColors[user.role];
  return (
    <Badge
      variant="default"
      className={`${roleColors.borderColor} ${roleColors.textColor} ${roleColors.bgColor} dark:bg-opacity-20`}
    >
      {user.role && user.role.charAt(0).toUpperCase() + user.role.slice(1)}
    </Badge>
  );
};

// --- Main Component ---

const UserPage: FC = () => {
  const { username } = useParams();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<IUser | null>(null);
  const [products, setProducts] = useState<IProduct[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { theme } = useTheme();

  // --- Fetching Data ---
  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${username}?fetchProducts=true`);
      if (!response.ok) {
        if (response.status === 404) {
          handleFetchError(`User with username "${username}" not found`);
          return;
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch user information."
        );
      }
      const { data } = (await response.json()) as {
        data: { user: IUser; products: IProduct[] };
      };
      setUser(data.user);
      setProducts(data.products || []);
    } catch (err: any) {
      handleFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async (userId: string) => {
    try {
      const res = await fetch(`/api/products/${userId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch products.");
      }
      const { data } = (await res.json()) as { data: IProduct[] };
      setProducts(data);
    } catch (err: any) {
      handleFetchError(err.message);
    }
  };

  useEffect(() => {
    if (username) {
      fetchUser();
    }
  }, [username]);

  useEffect(() => {
    if (user && user?.role === "seller" && user._id) {
      fetchProducts(user._id);
    }
  }, [isAddProductOpen]);

  useEffect(() => {
    if (user) {
      setIsFollowing(
        user.followers.some(
          (follower) => follower.toString() === session?.user?.id
        )
      );
    }
  }, [user]);

  useEffect(() => {
    if (status === "loading") setIsLoading(true);
  }, [status]);

  // --- Error Handling ---
  const handleFetchError = (message: string) => {
    setError(message);
    toast.error(message);
    setIsErrorOpen(true);
    setIsLoading(false);
  };

  // --- Actions ---
  const handleFollow = async () => {
    if (!user) return;
    try {
      setIsFollowing(!isFollowing);
      if (isFollowing)
        setUser({
          ...user,
          followers: user.followers.filter((id) => id !== session?.user?.id!),
        });
      else
        setUser({
          ...user,
          followers: [...user.followers!, session?.user?.id!],
        });
      const response = await fetch(`/api/users/${user.username}/follow`, {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to follow user.");
      }
      const updatedUser = (await response.json()) as {
        data: IUser;
        followed: boolean;
      };
    } catch (err: any) {
      setUser({
        ...user,
        followers: user.followers.filter((id) => id !== session?.user?.id),
      });
      setIsFollowing(!isFollowing);
      handleFetchError(err.message);
    }
  };

  // --- Render Loading State ---

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex flex-col">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-48" />
                <Separator />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-28" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div>
        <Card className="m-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <FaExclamationCircle className="h-8 w-8 text-gray-500" />
              <p className="text-gray-500">{error}</p>
            </div>
          </CardContent>
        </Card>
        <ErrorDialog
          title="Error"
          message={error}
          isOpen={isErrorOpen}
          onClose={() => setIsErrorOpen(false)}
        />
      </div>
    );
  }

  if (!user) return null;

  // --- Render User Page Content ---
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex flex-col gap-6">
        {/* User Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-center sm:justify-start items-center gap-2 flex-col sm:flex-row">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Profile Picture */}
                <div className="relative flex w-fit mx-auto">
                  <Avatar className="h-14 w-14">
                    <AvatarImage
                      src={
                        user.profile_picture ||
                        "https://i.ibb.co/2dh4YL3/nulprofile.jpg"
                      }
                      alt={`${user.username} profile picture`}
                    />

                    <AvatarFallback>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.verified && (
                    <VerifiedIcon
                      size={24}
                      className="text-blue-500 absolute -bottom-1 -right-0.5 bg-white rounded-full"
                    />
                  )}
                </div>

                {/* User Info */}
                <div className="flex flex-col gap-2 justify-center">
                  <div className="flex flex-col sm:flex-row text-start gap-2 items-center">
                    <p>{user.name}</p>
                    <div className="flex flex-row items-center">
                      <Link
                        className="text-base font-light items-center cursor-pointer hover:underline dark:text-gray-300 text-gray-600"
                        href={`/${user.username}`}
                      >
                        <span>@{user.username}</span>
                      </Link>
                      <HiOutlineClipboardCopy
                        size={20}
                        className="inline ml-1 cursor-pointer dark:text-gray-500 dark:hover:text-gray-300 text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          toast.success("Username copied to clipboard");
                          navigator.clipboard.writeText(user.username);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {userRoleBadge(user)}
                    {user.verified && (
                      <Badge
                        variant="default"
                        className="bg-blue-500 text-white"
                      >
                        Verified
                      </Badge>
                    )}
                    {user.kelas && user.nomor_kelas && (
                      <Badge variant="default">
                        {user.kelas}
                        {user.nomor_kelas}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="flex flex-1 text-sm items-center text-nowrap my-4 md:my-0 gap-2 w-full justify-center">
                {user.followers && (
                  <div className="flex flex-row gap-2 w-1/3 justify-center">
                    <div className="flex items-center gap-2 flex-col">
                      {user.followers.length}
                      <div className="flex gap-2 items-center text-xs opacity-50">
                        {/* <UsersIcon size={16} /> Followers */}
                        Followers
                      </div>
                    </div>
                  </div>
                )}
                {user.role === "seller" && products && (
                  <div className="flex flex-row gap-2 w-1/3 justify-center">
                    <div className="flex items-center gap-2 flex-col">
                      {products.length}
                      <div className="flex gap-2 items-center text-xs opacity-50">
                        {/* <TfiPackage size={16} /> Products */}
                        Products
                      </div>
                    </div>
                  </div>
                )}
                {user.role === "seller" && products && (
                  <div className="flex flex-row gap-2 w-1/3 justify-center">
                    <div className="flex items-center gap-2 flex-col">
                      {products.reduce(
                        (acc, curr) => acc + curr.purchased_by.length,
                        0
                      )}
                      <div className="flex gap-1 items-center text-xs opacity-50">
                        {/* <DollarSign size={16} /> Sold */}
                        Sold
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              {session?.user.id !== user._id && (
                <Button
                  variant={
                    isFollowing
                      ? "outline"
                      : theme === "dark"
                      ? "outline"
                      : "default"
                  }
                  size="sm"
                  className={`px-10 ${
                    isFollowing
                      ? "border-red-500 text-red-500 hover:text-red-500 hover:bg-red-500/5"
                      : theme === "dark"
                      ? "border-zinc-500 text-zinc-200 hover:text-zinc-200 hover:bg-zinc-500/5"
                      : ""
                  }`}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
              {user.phone_number && (
                <Button
                  variant="outline"
                  size="sm"
                  className={`px-4 dark:bg-transparent dark:text-green-500 dark:border-green-500 text-white bg-green-500 border-green-500`}
                  onClick={() => {
                    window.open(
                      `https://wa.me/+62${user.phone_number?.slice(
                        1,
                        user.phone_number.length
                      )}`,
                      "_blank"
                    );
                  }}
                >
                  <FaWhatsapp className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {user.bio && (
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  {user.bio}
                </div>
              )}
              <Separator />
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />{" "}
                {format(new Date(user.created_at), "dd MMMM yyyy")}
              </div>
              {user.phone_number && (
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  {user.phone_number}
                </div>
              )}
              {user.website_sosmed_link && (
                <div className={`flex items-center text-sm gap-2`}>
                  {user.website_sosmed_link
                    .toLowerCase()
                    .includes("instagram") ? (
                    <FaInstagram size={16} />
                  ) : (
                    <IoMdLink size={16} />
                  )}
                  <a
                    href={user.website_sosmed_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center text-sm gap-2 hover:underline`}
                  >
                    {user.website_sosmed_link
                      .toLowerCase()
                      .includes("instagram")
                      ? `@${user.website_sosmed_link.split("/")[3]}`
                      : user.website_sosmed_link}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
          {session?.user.id === user._id && (
            <EditProfilePage user={user} setUser={setUser} />
          )}
        </Card>

        {/* Products Section */}
        {user.role === "seller" && (
          <Card>
            <CardHeader>
              <CardTitle>
                Products
                <Separator className="my-5" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {(user.username == session?.user.username ||
                session?.user.role === "admin") && (
                <AddProductDialog
                  isOpen={isAddProductOpen}
                  setIsOpen={setIsAddProductOpen}
                  seller={user}
                />
              )}
            </CardContent>
            <CardContent>
              {products && products.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center">
                  {products.map((item, i) => (
                    <ProductCard
                      product={item}
                      key={i}
                      isLoading={isLoading}
                      user={user}
                      onProductChange={fetchUser}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <FaExclamation className="h-8 w-8 text-gray-500" />
                  <p className="text-gray-500">No products yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserPage;
