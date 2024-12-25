"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IProduct, IVariation } from "@/lib/db/models/product.model";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import useTheme from "next-theme";
import { IUser } from "@/lib/db/models/user.model";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { EditProductDialog } from "@/components/edit-product-dialog";
import { DeleteProductDialog } from "@/components/delete-product-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp } from "react-feather";
import AddProductToCart from "@/components/add-product-to-cart";
import Link from "next/link";

interface ProductOptionsProps {
  product: IProduct;
  user: IUser;
  onProductChange: () => void;
}

export const ProductOptions: React.FC<ProductOptionsProps> = ({
  product,
  user,
  onProductChange,
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
    <>
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
        onProductUpdated={onProductChange}
      />
      <DeleteProductDialog
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        product={product}
        onProductDeleted={onProductChange}
      />
    </>
  );
};

interface BigProductCardProps {
  product: IProduct;
  isLoading?: boolean;
  user: IUser;
  onProductChange: () => void;
}

const BigProductCard: React.FC<BigProductCardProps> = ({
  product,
  isLoading,
  user,
  onProductChange,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const { theme } = useTheme();
  const { data: session } = useSession();
  // Sort variations by price
  if (product.variations.length > 1)
    product.variations.sort((a, b) => a.price - b.price);

  const allImages = product.variations.reduce((acc, curr) => {
    return [...acc, ...curr.images];
  }, [] as string[]);

  const calculateDiscountedPrice = (price: number, variant: IVariation) => {
    const discountPercentage =
      variant.discount_type === "percent"
        ? variant.discount
        : (variant.discount_value / variant.price) * 100;
    return price - (price * discountPercentage) / 100;
  };

  const calculatePriceAndDiscount = () => {
    if (product.variations.length === 0)
      return {
        discountedPrice: 0,
        discount: null,
      };

    const currentVariant = product.variations[selectedVariant];
    const discountedPrice = calculateDiscountedPrice(
      currentVariant.price,
      currentVariant
    );
    const discountPercentage =
      currentVariant.discount_type === "percent"
        ? currentVariant.discount
        : (currentVariant.discount_value / currentVariant.price) * 100;

    return {
      discountedPrice: discountedPrice,
      discount:
        discountPercentage > 0 ? `-${Math.round(discountPercentage)}%` : null,
    };
  };

  const { discountedPrice, discount } = calculatePriceAndDiscount();

  const renderImage = () => {
    return (
      <Carousel className="w-full max-w-md flex flex-col mx-auto gap-2 p-6">
        <CarouselContent>
          {allImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full aspect-video">
                <Image
                  src={image || "/placeholder.png"}
                  alt={product.title}
                  className="rounded-md object-cover object-center"
                  fill
                  sizes="100%"
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex gap-2">
          {allImages.map((image, index) => (
            <Image
              src={image || "/placeholder.png"}
              alt={product.title}
              className="rounded-md object-center h-8 w-8"
              width={32} // Use Tailwind's spacing scale or a custom size
              height={32}
              key={index}
            />
          ))}
        </div>
        <div className="flex justify-center gap-2">
          <CarouselPrevious className="flex-1" />
          <CarouselNext className="flex-1" />
        </div>
      </Carousel>
    );
  };

  return (
    <div className="w-full p-4 md:px-10 flex flex-col gap-4">
      <Card className="dark:hover:bg-gray-900 relative hover:bg-gray-200 rounded-lg w-full flex flex-col md:flex-row h-full">
        {renderImage()}
        {(session?.user.role === "admin" ||
          user.username === session?.user.username) && (
          <ProductOptions
            product={product}
            user={user}
            onProductChange={onProductChange}
          />
        )}
        <CardContent className="w-full flex flex-col gap-2 pt-6">
          <div className="flex justify-between items-center">
            <div>
              {isLoading ? (
                <Skeleton className="h-4 w-3/4 rounded-md" />
              ) : (
                <h2 className="text-lg font-semibold truncate">
                  {product.title}
                </h2>
              )}
              {isLoading ? (
                <Skeleton className="h-4 w-1/2 rounded-md" />
              ) : (
                <p
                  className={`text-sm  truncate text-wrap ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {product.description}
                </p>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-1/4 rounded-md" />
            ) : (
              <>{discount && <Badge variant="destructive">{discount}</Badge>}</>
            )}
          </div>

          <Separator />
          {isLoading ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <Skeleton className="h-8 w-1/4 rounded-md" />
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col sm:flex-row items-center gap-2 justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold py-4">
                      {formatPrice(discountedPrice)}
                    </h3>
                  </div>
                  {product.variations?.length > 1 ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="w-full flex-1">
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
              </div>
              <div className="flex flex-col mt-auto">
                <div className="flex gap-2 items-center justify-between">
                  <AddProductToCart
                    productId={product._id!}
                    userId={session?.user.id!}
                    sellerId={user._id!}
                    variantTitle={
                      product.variations[selectedVariant].variant_title
                    }
                    fullWidth={true}
                  />
                </div>
                <div className="dark:border-gray-700"></div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <Link
          className="flex items-center p-4 w-fit"
          href={`/${product.seller_id.username}`}
        >
          <Avatar className="mr-2 h-8 w-8">
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
          <div className="flex flex-col">
            <h4 className="font-bold text-sm">{product.seller_id.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{product.seller_id.username}
            </p>
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default BigProductCard;
