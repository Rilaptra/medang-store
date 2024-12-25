"use client";
import React, { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaCartPlus, FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";

interface AddProductToCartProps {
  fullWidth?: boolean;
  buttonVariant?: ButtonProps["variant"];
  addIcon?: boolean;
  className?: string;
  userId: string;
  productId: string;
  variantTitle: string;
  sellerId: string;
}

const AddProductToCart: React.FC<AddProductToCartProps> = ({
  fullWidth = false,
  buttonVariant = "default",
  addIcon = true,
  className,
  userId,
  productId,
  variantTitle,
  sellerId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setCart, setItems } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_id: userId,
          product_id: productId,
          variation: variantTitle,
          seller_id: sellerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      const { cart, items } = await response.json();
      setCart(cart);
      setItems(items);
      toast.success("Item added to cart");
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={buttonVariant}
      className={cn({ "w-full": fullWidth }, className)}
      disabled={isLoading || isAdded}
    >
      {isLoading ? "Adding..." : isAdded ? "Added" : "Add to Cart"}
      {isAdded ? (
        <FaCheck className="ml-2" />
      ) : addIcon ? (
        <FaCartPlus className="ml-2" />
      ) : null}
    </Button>
  );
};

export default AddProductToCart;
