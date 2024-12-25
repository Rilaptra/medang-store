"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { FaTrash, FaCaretDown, FaPlus, FaMinus } from "react-icons/fa";
import Image from "next/image";
import { ICart } from "@/lib/db/models/cart.model";
import { formatPrice } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LucideExternalLink } from "lucide-react";

const CartPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, items, setCart, setItems, setLoading, setError, loading } =
    useCartStore();
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api/cart?buyer_id=${session?.user.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Gagal mengambil data keranjang dengan userId"
        );
      }
      const { cart: fetchedCart } = (await response.json()) as {
        cart: ICart;
      };

      if (fetchedCart) {
        setCart(fetchedCart);
        setItems(fetchedCart.items);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      fetchCart();
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    if (items && items.length > 0) {
      const calculateTotal = () => {
        let total = 0;
        for (const item of items) {
          const product = item.product_id.variations.find(
            (variation) => variation.variant_title === item.variation
          );
          if (product) {
            const discountPrice =
              product.discount_type === "percent"
                ? product.price * (1 - product.discount / 100)
                : product.price - product.discount_value;
            total += discountPrice * item.qty;
          }
        }
        setTotalAmount(total);
      };
      calculateTotal();
    }
  }, [items]);

  const handleRemoveItem = async (itemId: string) => {
    try {
      setItems(items?.filter((item) => item._id !== itemId)!);
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId, cart_id: cart?._id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus item");
      }

      const data = (await response.json()) as { cart: ICart; message: string };
      toast.success("Item dihapus dari keranjang!");
      setCart(data.cart);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (items && items.length > 0) {
      router.push("/checkout");
    } else {
      toast.error("Keranjang Anda kosong");
    }
  };

  const handleChangeVariation = async (
    itemId: string,
    newVariation: string
  ) => {
    try {
      if (
        newVariation === items?.find((item) => item._id === itemId)?.variation
      )
        return;
      setItems(
        items?.map((item) =>
          item._id === itemId ? { ...item, variation: newVariation } : item
        )!
      );
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: itemId,
          cart_id: cart?._id,
          variation: newVariation,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengubah variasi item");
      }
      const data = (await response.json()) as { message: string; cart: ICart };
      setCart(data.cart);
      toast.success("Variasi item berhasil diubah!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setItems(
        items?.map((item) =>
          item._id === itemId ? { ...item, qty: newQuantity } : item
        )!
      );
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: itemId,
          cart_id: cart?._id,
          qty: newQuantity,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengubah kuantitas item");
      }
    } catch (error: any) {
      await fetchCart();
      toast.error(error.message);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-2xl font-bold mb-4">
          <div>
            {" "}
            <Skeleton className="h-8 w-60" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <Skeleton className="h-24 w-24" />
                <div className="col-span-2 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return null;
  }

  if (!cart || !items || items.length === 0) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Keranjang Anda</h2>
        <p className="text-gray-500">Keranjang Anda saat ini kosong.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Keranjang Anda</h2>
      <div className="space-y-4">
        {items.map((item) => {
          const selectedVariation = item?.product_id?.variations?.find(
            (variation) => variation.variant_title === item.variation
          );
          if (!item || !item.product_id || !selectedVariation) return null;
          return (
            <Card key={item._id.toString()}>
              <CardContent className="flex gap-4 mt-8">
                <div className="max-h-40 relative flex-shrink-0 w-36">
                  <div className="aspect-square relative h-full">
                    {selectedVariation.images && (
                      <Image
                        src={selectedVariation.images[0]}
                        alt="Product Image"
                        fill
                        className="object-cover rounded"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2 ml-4">
                  <div className="flex justify-between items-start">
                    {" "}
                    <Link
                      href={`/${item.product_id.seller_id.username}/${item.product_id.title}`}
                      className="text-lg lg:text-2xl font-medium hover:underline"
                    >
                      <Link
                        href={`/${item.product_id.seller_id.username}/${item.product_id.title}`}
                        className="text-lg lg:text-2xl font-medium hover:underline flex items-center gap-1"
                      >
                        {item?.product_id?.title}{" "}
                        <LucideExternalLink className="ml-1 h-5 text-gray-500 dark:hover:text-gray-300 hover:text-gray-700" />
                      </Link>
                    </Link>
                    <Button
                      onClick={() => handleRemoveItem(item._id.toString()!)}
                      variant="destructive"
                      size="icon"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="text-gray-700 dark:text-gray-400 text-sm">
                      Variant : {selectedVariation.variant_title}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      Quantity :
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 ml-2"
                        onClick={() =>
                          handleQuantityChange(
                            item._id.toString(),
                            item.qty - 1
                          )
                        }
                        disabled={item.qty <= 1}
                      >
                        <FaMinus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="text"
                        pattern="[0-9]*"
                        min={1}
                        className="w-16 text-center"
                        value={item.qty}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value);
                          if (!isNaN(newQty)) {
                            handleQuantityChange(item._id.toString(), newQty);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleQuantityChange(
                            item._id.toString(),
                            item.qty + 1
                          )
                        }
                      >
                        <FaPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex justify-between"
                      >
                        {selectedVariation.variant_title}
                        <FaCaretDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {item?.product_id?.variations?.map((variation) => (
                        <DropdownMenuItem
                          key={variation.variant_title}
                          onClick={() =>
                            handleChangeVariation(
                              item._id.toString(),
                              variation.variant_title
                            )
                          }
                        >
                          {variation.variant_title}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* Seller Info */}
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          item.product_id.seller_id.profile_picture || ""
                          // "https://i.ibb.co/2dh4YL3/nulprofile.jpg"
                        }
                        alt={`${item.product_id.seller_id.username} profile picture`}
                      />
                      <AvatarFallback className="text-sm">
                        {item.product_id.seller_id.username
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-xs">
                      <span className="font-medium">
                        Seller: {item.product_id.seller_id.name}
                      </span>
                      <span className="font-normal text-zinc-400">
                        @{item.product_id.seller_id.username}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <Separator className="w-11/12 mx-auto mt-2 mb-4" />
              <CardFooter className="flex justify-between">
                <p className="text-lg font-medium">Price:</p>{" "}
                <p className="text-lg font-semibold">
                  {selectedVariation.discount > 1 ||
                  selectedVariation.discount === 0 ? (
                    <div>
                      <span className="line-through text-zinc-400 mr-2">
                        {formatPrice(selectedVariation.price)}
                      </span>
                      {selectedVariation.discount_type === "percent"
                        ? `${formatPrice(
                            selectedVariation.price *
                              (1 - selectedVariation.discount / 100)
                          )} x ${item.qty}`
                        : formatPrice(
                            selectedVariation.price - selectedVariation.discount
                          )}
                    </div>
                  ) : (
                    `${formatPrice(selectedVariation.price)} x ${item.qty}`
                  )}
                </p>
              </CardFooter>
            </Card>
          );
        })}
        <Separator />
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-medium">Total:</p>
          <p className="text-xl font-semibold">{formatPrice(totalAmount)}</p>
        </div>
        <Button onClick={handleCheckout} className="w-full mt-4">
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
