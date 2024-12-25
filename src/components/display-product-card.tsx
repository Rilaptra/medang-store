"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "react-feather";
import { toast } from "sonner";
import { IProduct, IVariation } from "@/lib/db/models/product.model";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/lib/utils";
import useTheme from "next-theme";
import { IUser } from "@/lib/db/models/user.model";
import { FaEdit, FaTrash } from "react-icons/fa";
import { EditProductDialog } from "./edit-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { useSession } from "next-auth/react";
import { BsInfoCircle } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DisplayProductCardProps {
  product: IProduct;
  user: IUser;
  onProductChange: () => void;
}

const DisplayProductCard: React.FC<DisplayProductCardProps> = ({
  product,
  user,
  onProductChange,
}) => {
  const { theme } = useTheme();
  const router = useRouter();

  const handleAddToCart = () => {
    toast.success(`Added ${product.title} to cart!`);
  };

  product.variations.sort((a, b) => a.price - b.price);

  const images = product.variations?.length
    ? product.variations[0]?.images
    : product.variations?.length === 0
    ? []
    : ["/placeholder.png"];

  const calculatePriceAndDiscount = () => {
    if (product.variations.length === 0) {
      return {
        minPriceAfterDiscount: 0,
        maxPriceAfterDiscount: 0,
        discount: null,
      };
    }
    const prices = product.variations.map((v) => v.price);

    const calculateDiscountedPrice = (price: number, variant: IVariation) => {
      const discountPercentage =
        variant.discount_type === "percent"
          ? variant.discount
          : (variant.discount_value / variant.price) * 100;
      return price - (price * discountPercentage) / 100;
    };

    const discountedPrices = product.variations.map((variant) =>
      calculateDiscountedPrice(variant.price, variant)
    );
    const minPriceAfterDiscount = Math.min(...discountedPrices);
    const maxPriceAfterDiscount = Math.max(...discountedPrices);

    const discounts = product.variations.map((variant) => {
      const discountPercentage =
        variant.discount_type === "percent"
          ? variant.discount
          : (variant.discount_value / variant.price) * 100;
      return discountPercentage;
    });

    const minDiscount = Math.min(...discounts);
    const maxDiscount = Math.max(...discounts);

    return {
      minPriceAfterDiscount: minPriceAfterDiscount,
      maxPriceAfterDiscount: maxPriceAfterDiscount,
      discount:
        minDiscount > 0 || maxDiscount > 0
          ? minDiscount === maxDiscount
            ? `-${Math.round(minDiscount)}%`
            : `-${Math.round(minDiscount)}% - ${Math.round(maxDiscount)}%`
          : null,
    };
  };

  const { minPriceAfterDiscount, maxPriceAfterDiscount, discount } =
    calculatePriceAndDiscount();

  return (
    <Card className="w-fit min-w-80 dark:hover:bg-gray-900 relative hover:bg-gray-200 rounded-lg">
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
      <CardContent className="space-y-2 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold truncate">{product.title}</h2>
            <p
              className={`text-sm  truncate ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {product.description}
            </p>
          </div>
          {discount && <Badge variant="destructive">{discount}</Badge>}
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
      <CardFooter className="pt-0 flex flex-col">
        <div className="flex gap-2  items-center justify-between">
          <Button
            className="w-1/2"
            variant="outline"
            onClick={() => router.push(`/products?id=${product._id}`)}
          >
            <BsInfoCircle className="mr-2 h-4 w-4" /> Details
          </Button>
          <Button className="w-1/2" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2">
          <div
            className="flex items-center hover:underline cursor-pointer"
            onClick={() => router.push(`/${product.seller_id.username}`)}
          >
            <Avatar className="mr-2 h-6 w-6">
              <AvatarImage
                src={
                  product.seller_id.profile_picture ||
                  "https://placehold.co/400x400"
                }
                alt={product.seller_id.name}
              />
              <AvatarFallback>
                {product.seller_id.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              @{product.seller_id.username}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DisplayProductCard;
