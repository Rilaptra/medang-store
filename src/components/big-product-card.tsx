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
import { Skeleton } from "@/components/ui/skeleton";
import useTheme from "next-theme";
import { IUser } from "@/lib/db/models/user.model";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { BsInfoCircle } from "react-icons/bs";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { data: session } = useSession();
  const [isSellerInfoOpen, setIsSellerInfoOpen] = useState(false);

  const handleAddToCart = () => {
    toast.success(`Added ${product.title} to cart!`);
    // tambahkan logic untuk keranjang belanja disini
  };

  // Sort variations by price
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
    if (isLoading) {
      return (
        <AspectRatio ratio={1 / 1}>
          <Skeleton className="rounded-md" />
        </AspectRatio>
      );
    } else {
      return (
        <Carousel className="w-full">
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
          <div className="flex justify-center gap-2 mt-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      );
    }
  };

  const handleToggleSellerInfo = () => {
    setIsSellerInfoOpen(!isSellerInfoOpen);
  };

  return (
    <div className="w-full p-4 md:px-10">
      <Card className="dark:hover:bg-gray-900 relative hover:bg-gray-200 rounded-lg w-full">
        {renderImage()}
        {(session?.user.role === "admin" ||
          user.username === session?.user.username) && (
          <ProductOptions
            product={product}
            user={user}
            onProductChange={onProductChange}
          />
        )}
        <CardContent className="space-y-2 py-4">
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
                  className={`text-sm  truncate ${
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
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/3 rounded-md" />
              <Skeleton className="h-8 w-1/4 rounded-md" />
            </div>
          ) : (
            <div className="flex items-center gap-5 justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  {formatPrice(discountedPrice)}
                </h3>
              </div>
              {product.variations?.length > 1 ? (
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
        <CardFooter className="pt-0 flex flex-col">
          {isLoading ? (
            <Skeleton className="h-10 w-full rounded-md" />
          ) : (
            <div className="flex gap-2  items-center justify-between">
              <Button
                className="w-1/2"
                variant="outline"
                onClick={() => router.push(`/${product.seller_id.username}`)}
              >
                <BsInfoCircle className="mr-2 h-4 w-4" /> Details
              </Button>
              <Button className="w-1/2" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="mt-2 border-t dark:border-gray-700">
            <Button
              onClick={handleToggleSellerInfo}
              className="w-full py-2 flex items-center justify-between"
            >
              <span className="text-sm font-semibold">Seller Info</span>
              {isSellerInfoOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
            {isSellerInfoOpen && (
              <div className="p-4">
                <div className="flex items-center mb-2">
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
                  <h4 className="font-bold text-md">
                    {product.seller_id.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Username: @{product.seller_id.username}
                </p>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BigProductCard;
