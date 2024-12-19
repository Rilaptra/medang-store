"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import UserCard from "@/components/user-card";
import { IUser } from "@/lib/db/models/user.model";
import { IProduct } from "@/lib/db/models/product.model";

export default function AdminDashboard() {
  const params = useParams();
  const router = useRouter();
  const route = params.route?.[0];
  const [data, setData] = useState<IUser[] | IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

    if (route) {
      fetchData();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [route]);

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
                "email" in item ? <UserCard key={i} user={item} /> : ""
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
