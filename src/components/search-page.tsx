import React, { useState, useEffect, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IProduct } from "@/lib/db/models/product.model";
import { Badge } from "./ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import ProductCard from "@/components/seller-product-card";

interface SearchPageProps {
  query?: string | null;
  category?: string | null;
}

export function calculatePriceAndDiscount(product: IProduct) {
  // product sorted from cheaper to more expensive
  const variations = product.variations.sort((a, b) => a.price - b.price);
  const minVariation = variations[0];
  const maxVariation = variations[variations.length - 1];
  const minVariationPriceDiscounted =
    minVariation.discount_type === "percent"
      ? minVariation.price * (1 - minVariation.discount / 100)
      : minVariation.price - minVariation.discount_value;
  const maxVariationPriceDiscounted =
    maxVariation.discount_type === "percent"
      ? maxVariation.price * (1 - maxVariation.discount / 100)
      : maxVariation.price - maxVariation.discount_value;

  const calc = {
    maxPrice: maxVariationPriceDiscounted,
    minPrice: minVariationPriceDiscounted,
    discount: {
      min: (minVariation.discount_type === "percent"
        ? minVariation.discount
        : (minVariationPriceDiscounted / minVariation.price) * 100
      ).toFixed(),
      max:
        maxVariationPriceDiscounted === minVariationPriceDiscounted
          ? 0
          : (maxVariation.discount_type === "percent"
              ? maxVariation.discount
              : (maxVariationPriceDiscounted / maxVariation.price) * 100
            ).toFixed(),
    },
  };

  return calc;
}

const SearchPage: React.FC<SearchPageProps> = ({ query, category }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `/api/search?page=${page}`;
        if (query !== null && query !== undefined) {
          url += `&query=${query}`;
        }
        if (category !== null && category !== undefined) {
          url += `&category=${category}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          const message = `Failed to fetch products: ${response.status}`;
          setError(message);
          console.error(message); // Use console.error for errors
          throw new Error(message);
        }
        const data = (await response.json()) as {
          data: IProduct[];
          totalPages: number;
          totalProducts: number;
          currentPage: number;
        };

        setProducts(data.data);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, category, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Skeleton Loading Component
  const LoadingSkeleton = () => {
    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="w-fit min-w-80 rounded-lg dark:bg-zinc-800">
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <Skeleton className="h-full w-full rounded-md bg-zinc-300 dark:bg-zinc-700" />
              </AspectRatio>
            </div>
            <CardContent className="space-y-2 py-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-3/5 bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <Skeleton className="h-7 w-4/5 bg-zinc-300 dark:bg-zinc-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-red-500">Error: {error}</div>
    );
  }

  // const renderProducts = () => (
  //   <div className="mx-auto">
  //     <div className="flex flex-wrap gap-4 mx-auto">
  //       {products.map((item, i) => {
  //         const { minPrice, maxPrice, discount } =
  //           calculatePriceAndDiscount(item);
  //         return (
  //           <Link
  //             key={i}
  //             href={`/${item.seller_id.username}/${item.title}`}
  //             className="grow w-full max-w-80"
  //           >
  //             <Card className="w-full dark:hover:bg-gray-900 relative hover:bg-gray-200 rounded-lg">
  //               <div className="relative">
  //                 <AspectRatio ratio={16 / 9}>
  //                   <Image
  //                     src={item.variations[0].images[0] || "/placeholder.png"}
  //                     alt={item.title}
  //                     className="rounded-md object-cover"
  //                     fill
  //                     sizes="100%"
  //                     priority
  //                   />
  //                 </AspectRatio>
  //                 {discount && (
  //                   <Badge
  //                     variant="destructive"
  //                     className="absolute top-2 right-2"
  //                   >
  //                     {discount.max
  //                       ? `${discount.min}% - ${discount.max}%`
  //                       : `${discount.min}%`}
  //                   </Badge>
  //                 )}
  //               </div>
  //               <CardContent className="space-y-2 py-4">
  //                 <h2 className="text-lg font-semibold line-clamp-2">
  //                   {item.title}
  //                 </h2>
  //                 <div className="flex items-center gap-5 justify-between">
  //                   <div>
  //                     <h3 className="text-xl font-semibold">
  //                       {formatPrice(minPrice)}{" "}
  //                       {item.variations.length > 1 &&
  //                         `- ${formatPrice(maxPrice)}`}
  //                     </h3>
  //                   </div>
  //                 </div>
  //               </CardContent>
  //             </Card>
  //           </Link>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
  const renderProducts = () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
      {products.map((item, i) => (
        <ProductCard
          product={item}
          key={i}
          // onProductChange={fetchUser}
        />
      ))}
    </div>
  );

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="container flex flex-col mx-auto p-6">
        {products.length === 0 ? (
          <div> No products found </div>
        ) : (
          renderProducts()
        )}

        <div className="flex gap-2 mx-auto justify-center items-center mt-auto">
          <Button
            variant="ghost"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>

          <span>
            {page} of {totalPages}
          </span>

          <Button
            variant="ghost"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>{" "}
    </Suspense>
  );
};

// function loading() {
//   return <div className="container mx-auto p-6">
//     <LoadingSkeleton />
//   </div>
// }

export default SearchPage;
