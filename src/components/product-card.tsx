// components/product-card.tsx
"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "react-feather";
import { toast } from "sonner";
import { IProduct } from "@/lib/db/models/product.model";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import useTheme from "next-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { IUser } from "@/lib/db/models/user.model";
import { FaEdit, FaTrash } from "react-icons/fa";
import { EditProductDialog } from "./edit-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";

interface ProductCardProps {
  product: IProduct;
  isLoading?: boolean;
  user: IUser;
  onProductChange: () => void; // Add this line
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isLoading,
  user,
  onProductChange, // Add this line
}) => {
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const { theme } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddToCart = () => {
    toast.success(`Added ${product.title} to cart!`);
    // tambahkan logic untuk keranjang belanja disini
  };

  const currentPrice = product.variations[selectedVariant]?.price;

  const images = product.variations?.length
    ? product.variations[selectedVariant]?.images
    : product.variations?.length === 0
    ? []
    : ["/placeholder.png"];

  const discountPercentage =
    product.discount_type === "percent"
      ? product.discount
      : (product.discount_value / currentPrice) * 100;

  const discountPriceVariant =
    product.discount > 0 || product.discount_value > 0
      ? currentPrice -
        (product.discount_type === "percent"
          ? (currentPrice * product.discount) / 100
          : product.discount_value)
      : currentPrice;

  const renderImage = () => {
    if (isLoading) {
      return (
        <AspectRatio ratio={1 / 1}>
          <Skeleton className="rounded-md" />
        </AspectRatio>
      );
    } else {
      return (
        <AspectRatio ratio={16 / 9}>
          <Image
            src={images?.length > 0 ? images[0] : "/placeholder.png"}
            alt={product.title}
            className="rounded-md object-cover"
            fill
            sizes="100%"
            priority
          />
        </AspectRatio>
      );
    }
  };

  return (
    <Card className="w-fit min-w-80 dark:hover:bg-gray-900 relative hover:bg-gray-200 rounded-lg">
      {renderImage()}
      <div className="absolute top-1 right-1 flex gap-1">
        <Button
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
        onProductUpdated={onProductChange} // Pass the callback here
      />
      <DeleteProductDialog
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        product={product}
        onProductDeleted={onProductChange} // Pass the callback here
      />
      <CardContent className="space-y-2 py-4">
        {isLoading ? (
          <Skeleton className="h-4 w-3/4 rounded-md" />
        ) : (
          <h2 className="text-lg font-semibold truncate">{product.title}</h2>
        )}
        {isLoading ? (
          <Skeleton className="h-4 w-1/2 rounded-md" />
        ) : (
          <p
            className={`text-sm  truncate ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-4 w-1/4 rounded-md" />
          ) : (
            <>
              {(product.discount > 0 || product.discount_value > 0) && (
                <Badge variant="destructive">
                  -{Math.round(discountPercentage)}%
                </Badge>
              )}
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
              {product.discount > 0 && (
                <span
                  className={`line-through text-sm  ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {formatPrice(product.variations[selectedVariant]?.price)}
                </span>
              )}
              <h3 className="text-xl font-semibold">
                {formatPrice(discountPriceVariant)}
              </h3>
            </div>
            {product.variations?.length ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {product.variations[selectedVariant]?.variant_title ||
                      "Select Variant"}
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit bg-white dark:bg-gray-900 border rounded-md shadow-md">
                  {product.variations.map((variant, index) => (
                    <DropdownMenuItem
                      key={index}
                      onSelect={() => setSelectedVariant(index)}
                      className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      {variant.variant_title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        {isLoading ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <Button className="w-full" onClick={handleAddToCart}>
            Add to Cart <ShoppingCart className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
