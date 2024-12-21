"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import UserCard from "@/components/user-card";
import { IUser } from "@/lib/db/models/user.model";
import { IProduct } from "@/lib/db/models/product.model";
import { toast } from "sonner";

const fetchData = async (
  route: string | undefined,
  setData: (data: IUser[] | IProduct[]) => void,
  setLoading: (loading: boolean) => void,
  data: IUser[] | IProduct[]
) => {
  if (!data) {
    setLoading(true);
  }
  try {
    const response = await fetch(`/api/admin/${route}`);
    if (response.ok) {
      const result = await response.json();
      setData(result.data || []);
    } else {
      console.error("Failed to fetch data");
      setData([]);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setData([]);
  } finally {
    setLoading(false);
  }
};

export default function AdminDashboard() {
  const params = useParams();
  const router = useRouter();
  const route = params.route?.[0];
  const [data, setData] = useState<IUser[] | IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route) {
      fetchData(route, setData, setLoading, data);
    } else {
      setData([]);
      setLoading(false);
    }
  }, [route]);

  const handleVerifyUpdate = async (user: IUser) => {
    try {
      const response = await fetch("/api/admin/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          verified: !user.verified,
          role: user.role,
        }),
      });

      if (response.ok) {
        toast.success(
          `User has been ${
            !user.verified ? "verified" : "unverified"
          } successfully`
        );
        fetchData(route, setData, setLoading, data);
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to update user role: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error: any) {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  };

  const handleRoleUpdate = async (
    user: IUser,
    newRole: "admin" | "seller" | "member"
  ) => {
    try {
      const response = await fetch("/api/admin/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, role: newRole }),
      });

      if (response.ok) {
        toast.success(`User role updated to ${newRole}`);
        fetchData(route, setData, setLoading, data);
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to update user role: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error: any) {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  };

  const handleDeleteUser = async (user: IUser) => {
    try {
      const response = await fetch("/api/admin/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        fetchData(route, setData, setLoading, data);
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to delete user: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <Button
          variant={route === "user" ? "default" : "outline"}
          onClick={() => router.push("/admin/user")}
        >
          <User className="mr-2 h-4 w-4" />
          Users
        </Button>
        <Button
          variant={route === "products" ? "default" : "outline"}
          onClick={() => router.push("/admin/products")}
        >
          <Package className="mr-2 h-4 w-4" />
          Products
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {route === "user"
              ? "User Management"
              : route === "products"
              ? "Product Management"
              : "Admin Dashboard"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid columns-2">
          {loading ? (
            <p>Loading...</p>
          ) : data.length > 0 ? (
            <div className="gap-2 justify-start flex-col md:flex-row flex-wrap flex">
              {data.map((item, i) =>
                "email" in item ? (
                  <UserCard
                    key={i}
                    user={item}
                    handleDeleteUser={handleDeleteUser}
                    handleVerifyUpdate={handleVerifyUpdate}
                    handleRoleUpdate={handleRoleUpdate}
                  />
                ) : (
                  ""
                )
              )}
            </div>
          ) : (
            <p>{route ? "No data available." : "Select a category to view."}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
