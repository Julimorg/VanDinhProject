import type { IGetAllProductResponse } from "../Interface/Product/IGetAllProducts";
import { canAddToCart, formatPrice, getAvailabilityMessage, getMaxOrderQuantity, getStockBadgeProps, getStockDisplayText, getStockStatus, isLowStock, isOutOfStock, isVeryLowStock, validateQuantity } from "../Utils/utils";

export const useProductCardUtils = (product: IGetAllProductResponse) => {
  const quantity = product.productQuantity;
  
  return {
    //? Status checks
    isOutOfStock: isOutOfStock(quantity),
    isLowStock: isLowStock(quantity),
    isVeryLowStock: isVeryLowStock(quantity),
    canAddToCart: canAddToCart(quantity),
    
    //? Display data
    stockStatus: getStockStatus(quantity),
    stockBadge: getStockBadgeProps(quantity),
    stockDisplayText: getStockDisplayText(quantity),
    availabilityMessage: getAvailabilityMessage(quantity),
    formattedPrice: formatPrice(product.productPrice),
    
    //? Quantity limits
    maxOrderQuantity: getMaxOrderQuantity(quantity),
    
    //? Utility functions
    validateQuantity: (inputValue: number) => validateQuantity(inputValue, quantity),
  };
};
