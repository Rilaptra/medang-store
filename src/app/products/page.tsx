"use client";
import React, { useState, useEffect } from "react";
import DisplayProductCard from "@/components/display-product-card";
import BigProductCard from "@/components/big-product-card";
import { IProduct } from "@/lib/db/models/product.model";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IUser } from "@/lib/db/models/user.model";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/products${productId ? `?id=${productId}` : ""}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            setIsErrorDialogOpen(true);
            setError("Product not found");
            const allProductsResponse = await fetch(`/api/products`);
            if (!allProductsResponse.ok) {
              setError("Failed to load products.");
              return;
            }
            const allProductsData = await allProductsResponse.json();
            setProducts(allProductsData.data);
          } else {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          if (productId) {
            if (data.data) {
              setSelectedProduct(data.data);
              const res = await fetch(
                `/api/users/${(data.data as IProduct).seller_id.username}`
              );
              if (!res.ok) {
                const data = await res.json();
                throw new Error(
                  data.message || "Failed to fetch user information."
                );
              }
              const user = (await res.json()) as { data: IUser };
              setUser(user.data);
            }
          } else {
            setProducts(data.data);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [productId]);

  const handleCloseErrorDialog = () => {
    setIsErrorDialogOpen(false);
    router.push("/products");
  };

  if (isLoading)
    return (
      <div className="w-full p-4 flex justify-center items-center">
        Loading products...
      </div>
    );

  if (error && !productId) {
    return (
      <div className="w-full p-4 flex justify-center items-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-6 md:p-10">
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Not Found</DialogTitle>
          </DialogHeader>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="flex justify-center mt-4">
            <Button onClick={handleCloseErrorDialog}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-wrap justify-center gap-6 ">
        {!productId &&
          products?.map((product) => (
            <div key={product._id} className="max-w-sm w-full">
              <DisplayProductCard
                product={product}
                user={product.seller_id as IUser}
                onProductChange={() => {}}
              />
            </div>
          ))}
        {productId && selectedProduct && (
          <div key={selectedProduct._id} className="w-full">
            <BigProductCard
              product={selectedProduct}
              isLoading={isLoading}
              user={user!}
              onProductChange={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
