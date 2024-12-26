"use client";
import BigProductCard from "@/components/big-product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { IProduct } from "@/lib/db/models/product.model";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Avatar } from "@radix-ui/react-avatar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ProductPage() {
  const { username, productTitle } = useParams() as {
    username: string;
    productTitle: string;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [error, setError] = useState("");
  async function getProduct() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${username}/${productTitle}`);
      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
      }
      const data = (await response.json()) as { data: IProduct };
      console.log(data);
      setProduct(data.data);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, [productTitle]);
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 flex flex-col gap-4">
        <div className="w-full p-4 md:px-10 flex flex-col gap-4">
          <Card className="dark:hover:bg-zinc-900 relative rounded-lg w-full flex flex-col md:flex-row h-fulll">
            <div className="w-full h-max-40 max-w-md flex flex-col mx-auto gap-2 p-6">
              <Skeleton className="rounded-md w-full aspect-video h-full" />
              <div className="flex gap-2 w-full">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton className="w-[32] h-[32]" key={i} />
                ))}
              </div>
              <div className="flex gap-2">
                <Skeleton className="rounded-md w-full h-10" />
                <Skeleton className="rounded-md w-full h-10" />
              </div>
            </div>
            <CardContent className="w-full flex flex-col gap-2 pt-6">
              <div className="flex justify-between items-center">
                <div className="h-fit w-1/2">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md mt-2" />
                </div>
                <Skeleton className="h-5 w-1/6 rounded-full" />
              </div>
              <Separator />
              <div className="flex flex-col">
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-8 w-1/3 rounded-md" />
                  <Skeleton className="h-8 w-1/4 rounded-md" />
                </div>
                <Skeleton className="h-10 w-full rounded-md mt-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <div className="flex items-center p-4 w-full">
              <Avatar className="mr-2 h-8 w-8">
                <Skeleton className="rounded-full h-full w-full" />
              </Avatar>
              <div className="flex h-fit w-1/2 flex-col">
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md mt-1" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container min-h-screen mx-auto px-4">{error}</div>;
  }

  return (
    <div className="container min-h-screen mx-auto">
      <BigProductCard
        product={product}
        user={product.seller_id}
        onProductChangeAction={getProduct}
      />
    </div>
  );
}

export default ProductPage;
