import React, { useState, useEffect } from "react";
import ProductCard from "./seller-product-card";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import useTheme from "next-theme";
import { calculatePriceAndDiscount } from "@/app/utils/utils";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BsInfoCircle } from "react-icons/bs";
import Image from "next/image";

interface Product {
  _id: string;
  title: string;
  // Add other properties based on the API response if you plan to display them
}

interface SearchPageProps {
  query?: string | null; // Allow query to be a string or null
  category?: string | null; // Allow category to be a string or null
}

const SearchPage: React.FC<SearchPageProps> = ({ query, category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `/api/search?page=${page}`;
        // Handle null query
        if (query !== null && query !== undefined) {
          url += `&query=${query}`;
        }
        // Handle null category
        if (category !== null && category !== undefined) {
          url += `&category=${category}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          const message = `Failed to fetch products: ${response.status}`;
          setError(message);
          console.log(message);
          throw new Error(message);
        }
        const data = await response.json();

        setProducts(data.data);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
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

  if (loading) {
    return <div className="container mx-auto p-6">Loading products...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-6">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {products.length === 0 ? (
        <div> No products found </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {products.map((item, i) => {
            const { minPriceAfterDiscount, maxPriceAfterDiscount, discount } =
              calculatePriceAndDiscount(item);
            return (
              <Card
                key={i}
                className="w-fit min-w-80 dark:hover:bg-gray-900 relative hover:bg-gray-200 rounded-lg"
              >
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={item.variations[0].images[0] || "/placeholder.png"}
                      alt={item.title}
                      className="rounded-md object-cover"
                      fill
                      sizes="100%"
                      priority
                    />
                  </AspectRatio>
                </div>
                <CardContent className="space-y-2 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold line-clamp-2">
                        {item.title}
                      </h2>
                    </div>
                    <>
                      {item.discount && (
                        <Badge variant="destructive">{item.discount}</Badge>
                      )}
                    </>
                  </div>

                  <Separator />
                  <div className="flex items-center gap-5 justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {formatPrice(minPriceAfterDiscount)} -{" "}
                        {formatPrice(maxPriceAfterDiscount)}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 mx-auto mt-6 justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>

        <span>
          {" "}
          {page} of {totalPages}{" "}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SearchPage;
