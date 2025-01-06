import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import useTheme from "next-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import AddProductToCart from "@/components/add-product-to-cart";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon, Info } from "lucide-react";
import { IProduct, IVariation } from "@/lib/db/models/product.model";
import { IUser } from "@/lib/db/models/user.model";
import { ProductOptions } from "./seller-product-card";

interface BigProductCardProps {
  product: IProduct;
  isLoading?: boolean;
  user: IUser;
  onProductChangeAction: () => void;
}

const BigProductCard: React.FC<BigProductCardProps> = ({
  product,
  isLoading,
  user,
  onProductChangeAction,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const { theme } = useTheme();
  const { data: session } = useSession();
  const [isSellerInfoOpen, setIsSellerInfoOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user?.followers?.includes(session?.user?.id!) || false
  );

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

  const handleToggleFollow = async () => {
    if (!session?.user) return;
    try {
      const response = await fetch(`/api/users/${user.username}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const { followed, data } = await response.json();
        setIsFollowing(followed);
        user.followers = data.followers;
      } else {
        console.error("Failed to follow/unfollow user");
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };
  const { discountedPrice, discount } = calculatePriceAndDiscount();

  const renderImage = () => {
    if (isLoading) {
      return (
        <AspectRatio ratio={1 / 1}>
          <Skeleton className="rounded-md" />
        </AspectRatio>
      );
    } else {
      return (
        <Carousel className="w-full flex flex-col gap-2 p-6">
          <CarouselContent>
            {allImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full aspect-video">
                  <Image
                    src={image || "/placeholder.png"}
                    alt={product.title}
                    className="rounded-md object-cover"
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
                className="rounded-md object-center"
                width={32}
                height={32}
                key={index}
              />
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <CarouselPrevious className="w-full static md:py-6 rounded-lg translate-y-0" />
            <CarouselNext className="w-full static md:py-6 rounded-lg translate-y-0" />
          </div>
        </Carousel>
      );
    }
  };

  const handleToggleSellerInfo = () => {
    setIsSellerInfoOpen(!isSellerInfoOpen);
  };

  return (
    <div className="w-full p-4 md:px-10 flex flex-col gap-4">
      <Card className="dark:hover:bg-gray-900 relative hover:bg-gray-200 rounded-lg w-full flex flex-col xl:flex-row h-full hover:bg-card">
        {renderImage()}
        {(session?.user.role === "admin" ||
          user.username === session?.user.username) && (
          <ProductOptions
            product={product}
            user={user}
            onProductChangeAction={onProductChangeAction}
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
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-1/4 rounded-md" />
            ) : (
              <>{discount && <Badge variant="destructive">{discount}</Badge>}</>
            )}
          </div>

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
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="hover:bg-card flex justify-between">
        <Link
          className="flex items-center p-4 w-fit"
          href={`/${user.username}`}
        >
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage
              src={user.profile_picture || "https://placehold.co/400x400"}
              alt={user.name}
            />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h4 className="font-bold text-sm">{user.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>
          </div>
        </Link>
        <div className="flex gap-3 p-4">
          <Button
            variant="outline"
            className={`flex items-center gap-2 w-auto ${
              isFollowing
                ? "text-red-500 border-red-500 hover:text-red-500"
                : ""
            }`}
            onClick={handleToggleFollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
          <Link href={`/${user.username}`}>
            <Button variant="default" className="flex items-center gap-2">
              <Info />
              Seller Info
            </Button>
          </Link>
        </div>
      </Card>
      <Card className="p-6">
        {isLoading ? (
          <Skeleton className="h-4 w-1/2 rounded-md" />
        ) : (
          <div className="flex flex-col gap-3">
            <h3 className="text-lg">Deskripsi produk</h3>
            <Separator />
            <p
              className={`text-sm  truncate ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {product.description}
            </p>
          </div>
        )}
      </Card>
      <Card className="p-6">
        {isLoading ? (
          <Skeleton className="h-4 w-1/2 rounded-md" />
        ) : (
          <div className="flex flex-col gap-3">
            <h3 className="text-lg">Rating produk</h3>
            <Separator />
            <p
              className={`text-sm  truncate ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {product.description}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BigProductCard;
