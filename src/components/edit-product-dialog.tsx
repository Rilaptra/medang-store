// components/edit-product-dialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { IProduct, IVariation } from "@/lib/db/models/product.model";
import { FaPlus, FaMinus, FaImage, FaPlusCircle } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { Loader2 } from "lucide-react";

interface EditProductDialogProps {
  product: IProduct;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onProductUpdated: () => void;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({
  product,
  isOpen,
  setIsOpen,
  onProductUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<IProduct>({
    defaultValues: {
      ...product,
      variations: product.variations.map((variation) => ({
        ...variation,
      })),
    } as IProduct,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variations",
  });

  const handleAddVariation = () => {
    append({
      variant_title: "",
      price: 0,
      stock: 0,
      images: [],
      discount: 0,
      discount_value: 0,
      discount_type: "percent",
    });
  };

  const onSubmit = async (values: IProduct) => {
    if (values.variations.length === 0) {
      toast.error("Please add at least one variation");
      return;
    } else if (
      values.variations.some((variation) => variation.images.length === 0)
    ) {
      toast.error("Please add at least one image for each variation");
      return;
    }
    console.log(values, "ini values");
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Product updated successfully");
        form.reset();
        setIsOpen(false);
        onProductUpdated();
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to update product: ${
            errorData.message || "Something went wrong"
          }`
        );
      }
    } catch (error: any) {
      toast.error(`Failed to update product: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = Array.from(e.target.files || []);

    if (files && files.length > 0) {
      Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(file);
            })
        )
      ).then((newImages) => {
        const currentImages =
          form.getValues(`variations.${index}.images`) || [];
        form.setValue(`variations.${index}.images`, [
          ...currentImages,
          ...newImages,
        ]);
      });
    }
  };

  const handleRemoveImage = (index: number, imageIndex: number) => {
    const currentImages = form.getValues(`variations.${index}.images`) || [];
    const updatedImages = currentImages.filter((_, i) => i !== imageIndex);
    form.setValue(`variations.${index}.images`, updatedImages);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Edit the details for the product.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Product category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Variations Section */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold">Variations</h4>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddVariation}
                >
                  <FaPlus className="mr-2" />
                  Add Variation
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border p-4 rounded-md shadow-sm mb-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-md font-semibold">
                      Variation #{index + 1}
                    </h5>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <FaMinus className="mr-2" />
                      Remove
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`variations.${index}.variant_title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Color, Size" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`variations.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Variation price"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variations.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Stock available"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variations.${index}.discount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Discount percentage"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variations.${index}.discount_value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Discount value"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variations.${index}.discount_type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="border rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-transparent dark:border-zinc-700 dark:text-zinc-300 dark:focus:ring-zinc-500"
                            >
                              <option
                                value="percent"
                                className="bg-transparent dark:bg-zinc-800"
                              >
                                Percent
                              </option>
                              <option
                                value="value"
                                className="bg-transparent dark:bg-zinc-800"
                              >
                                Value
                              </option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variations.${index}.images`}
                      render={() => (
                        <FormItem>
                          <FormLabel>Images</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2 flex-wrap">
                              <label htmlFor={`image-upload-${index}`}>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  asChild
                                >
                                  <span>
                                    <FaImage className="mr-2" /> Upload Image
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleImageUpload(e, index)
                                      }
                                      className="hidden"
                                      id={`image-upload-${index}`}
                                      multiple
                                    />
                                  </span>
                                </Button>
                              </label>

                              {form.watch(`variations.${index}.images`) &&
                                form
                                  .watch(`variations.${index}.images`)
                                  .map((image, imageIndex) => (
                                    <div
                                      key={imageIndex}
                                      className="relative h-32 rounded-md border overflow-hidden mr-2 mb-2"
                                    >
                                      <img
                                        src={image}
                                        alt="Uploaded"
                                        className="w-full h-full object-cover"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 p-0 rounded-full bg-white/60 hover:bg-white/80"
                                        onClick={() =>
                                          handleRemoveImage(index, imageIndex)
                                        }
                                      >
                                        <IoIosClose className="w-7 h-7 text-black" />
                                      </Button>
                                    </div>
                                  ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex justify-around"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              <FaPlusCircle className="mr-2" /> Update Product
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
