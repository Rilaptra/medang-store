"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IProduct } from "@/lib/db/models/product.model";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import useTheme from "next-theme";
import { IUser } from "@/lib/db/models/user.model";
import { FaEdit, FaTrash } from "react-icons/fa";
import { EditProductDialog } from "./edit-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { calculatePriceAndDiscount } from "./search-page";

interface ProductOptionsProps {
  product: IProduct;
  user: IUser;
  onProductChangeAction: () => void;
}

export const ProductOptions: React.FC<ProductOptionsProps> = ({
  product,
  user,
  onProductChangeAction,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: session } = useSession();

  if (
    !(
      user.username === session?.user.username || session?.user.role === "admin"
    )
  )
    return null;
  return (
    <div>
      <div className="absolute top-1 right-1 flex gap-1">
        <Button
          variant="ghost"
          onClick={() => setIsEditModalOpen(true)}
          className="bg-white dark:bg-black rounded-full aspect-square p-0 hover:bg-gray-900"
        >
          <FaEdit className="dark:text-white text-gray-600" />
        </Button>
        <Button
          onClick={() => setIsDeleteModalOpen(true)}
          className="bg-white dark:bg-black rounded-full aspect-square p-0 hover:bg-gray-900"
          variant="destructive"
        >
          <FaTrash className="dark:text-white text-gray-600" />
        </Button>
      </div>
      <EditProductDialog
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        product={product}
        onProductUpdated={onProductChangeAction}
      />
      <DeleteProductDialog
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        product={product}
        onProductDeleted={onProductChangeAction}
      />
    </div>
  );
};

interface ProductCardProps {
  product: IProduct;
  isLoading?: boolean;
  // user: IUser;
  // onProductChangeAction: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isLoading,
  // onProductChangeAction,
}) => {
  const { theme } = useTheme();

  const handleAddToCart = () => {
    toast.success(`Added ${product.title} to cart!`);
    // tambahkan logic untuk keranjang belanja disini
  };

  // Sort variations by price
  product.variations.sort((a, b) => a.price - b.price);

  const images = product.variations?.length
    ? product.variations[0]?.images
    : product.variations?.length === 0
    ? []
    : ["/placeholder.png"];

  const { minPrice, maxPrice, discount } = calculatePriceAndDiscount(product);

  const renderImage = () => {
    if (isLoading) {
      return (
        <AspectRatio ratio={1 / 1}>
          <Skeleton className="rounded-md" />
        </AspectRatio>
      );
    } else {
      return (
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={images[0] || "/placeholder.png"}
              alt={product.title}
              className="rounded-md object-cover"
              fill
              sizes="100%"
              priority
            />
          </AspectRatio>
        </div>
      );
    }
  };

  return (
    <Card className="w-full max-w-80 dark:hover:bg-gray-900 relative hover:bg-gray-200 rounded-lg">
      {/* <ProductOptions
        product={product}
        user={product.seller_id}
        onProductChangeAction={onProductChangeAction}
      /> */}
      <Link href={`/${product.seller_id.username}/${encodeURI(product.title)}`}>
        {renderImage()}
        <CardContent className="flex flex-col gap-2 py-4">
          <div className="flex justify-between items-center">
            <div>
              {isLoading ? (
                <Skeleton className="h-4 w-3/4 rounded-md" />
              ) : (
                <h2 className="flex-1 font-semibold truncate">
                  {product.title}
                </h2>
                // )}
                // {isLoading ? (
                //   <Skeleton className="h-4 w-1/2 rounded-md" />
                // ) : (
                //   <p
                //     className={`text-sm  truncate ${
                //       theme === "dark" ? "text-gray-400" : "text-gray-500"
                //     }`}
                //   >
                //     {product.description.length > 25
                //       ? product.description.slice(0, 25) + "..."
                //       : product.description}
                //   </p>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-1/4 rounded-md" />
            ) : (
              <>
                {
                  <Badge variant="destructive">
                    {discount.min}%
                    {(discount.max as number) > 0 && ` - ${discount.max}%`}
                  </Badge>
                }
              </>
            )}
          </div>

          <Separator />
          {isLoading ? (
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/3 rounded-md" />
              <Skeleton className="h-8 w-1/4 rounded-md" />
            </div>
          ) : (
            <div className="flex items-center gap-5 justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {formatPrice(minPrice)}{" "}
                  {product.variations.length > 1 &&
                    `- ${formatPrice(maxPrice)}`}
                </h3>
              </div>
            </div>
          )}
        </CardContent>
        {/* <CardFooter className="pt-0">
        {isLoading ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <div className="flex gap-2 w-full items-center justify-between">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => router.push(`/products?id=${product._id}`)}
            >
              <BsInfoCircle className="mr-2 h-4 w-4" /> Details
            </Button>
            <Button className="w-fit" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter> */}
      </Link>
    </Card>
  );
};

export default ProductCard;
