"use client";
import { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IUser } from "@/lib/db/models/user.model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  CalendarIcon,
  LinkIcon,
  PhoneIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { IProduct } from "@/lib/db/models/product.model";
import ProductCard from "@/components/product-card";
import { FaExclamation, FaExclamationCircle } from "react-icons/fa";
import ErrorDialog from "@/components/error-dialog";
import { AddProductDialog } from "@/components/add-product-dialog";
import { useSession } from "next-auth/react";
import EditProfilePage from "@/components/edit-profile";
import { Skeleton } from "@/components/ui/skeleton";

const UserPage: FC = () => {
  const { username } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [product, setProduct] = useState<IProduct[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { data: session } = useSession();
  const [userNotFound, setUserNotFound] = useState(false);

  const fetchProducts = async (user: IUser) => {
    try {
      const res = await fetch(`/api/products/${user._id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch products.");
      }
      const data: { data: IProduct[] } = await res.json();
      setProduct(data.data);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    setUserNotFound(false);
    try {
      const response = await fetch(`/api/users/${username}?fetchProducts=true`);
      if (!response.ok) {
        if (response.status === 404) {
          setUserNotFound(true);
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
      if (data.products) {
        setProduct(data.products);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user && username) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "seller") {
      fetchProducts(user);
    }
  }, [isAddOpen]);

  if (isLoading)
    return (
      <div className="container mx-auto py-8">
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

  if (error) {
    return (
      <div>
        <Card className="m-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <FaExclamationCircle className="h-8 w-8 text-gray-500" />
              <p className="text-gray-500">
                User with username{" "}
                <span className="font-bold">"{username}"</span> not found
              </p>
            </div>
          </CardContent>
        </Card>
        <ErrorDialog
          title="Error"
          message={error}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <Link href={"/sellers"} className="mb-4 inline-flex items-center gap-2">
        <ArrowLeftIcon className="h-4 w-4" /> Back
      </Link>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={user.profile_picture || "/default_profile.jpg"}
                />
                <AvatarFallback>
                  {user.name?.[0] || user.username?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="font-bold text-xl">
                  {user.name || user.username}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{user.role}</Badge>
                  {user.verified && <Badge variant="default">Verified</Badge>}
                  {user.kelas && user.nomor_kelas && (
                    <Badge variant="default">
                      {user.kelas}
                      {user.nomor_kelas}
                    </Badge>
                  )}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.bio && (
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  {user.bio}
                </div>
              )}
              <Separator />
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Member Since:{" "}
                {format(new Date(user.created_at), "MMMM dd, yyyy")}
              </div>
              {user.phone_number && (
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  {user.phone_number}
                </div>
              )}
              {user.website_sosmed_link && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />{" "}
                  <a
                    href={user.website_sosmed_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {user.website_sosmed_link}
                  </a>
                </div>
              )}
              {user.followers && (
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" /> Followers (
                  {user.followers.length})
                </div>
              )}
            </div>
          </CardContent>
          {session?.user.id === user._id && (
            <EditProfilePage user={user} setUser={setUser} />
          )}
        </Card>

        {user.role === "seller" && (
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center p-6">
              <AddProductDialog
                isOpen={isAddOpen}
                setIsOpen={setIsAddOpen}
                seller={user}
              />
            </CardContent>

            <CardContent>
              {product ? (
                <div className="flex flex-wrap gap-4">
                  {product.map((item, i) => (
                    <ProductCard
                      product={item}
                      key={i}
                      isLoading={isLoading}
                      user={user}
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
