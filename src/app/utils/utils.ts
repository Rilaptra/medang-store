export const calculatePriceAndDiscount = (product: object) => {
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
