import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCardProps } from "./types";
import Image from "next/image";

export default function ProductListItem({
  product,
  onAddToCart,
}: ProductCardProps) {
  const discountPercent = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      )
    : 0;

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <Link href={`ProductDetail?id=${product.id}`}>
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="flex-shrink-0 w-full sm:w-40 md:w-48 h-48 sm:h-32 md:h-auto relative">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain rounded-lg w-full h-full py-1"
            />

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 hover:bg-red-500 text-xs">
                -{discountPercent}%
              </Badge>
            )}

            {/* Stock Status */}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="bg-white text-gray-900 text-xs"
                >
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-4 sm:p-6 flex flex-col flex-1 min-w-0">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 sm:mb-0">
                  {product.brand}
                </p>
                {product.rating && (
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product?.rating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">
                      ({product?.rating || 0})
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight mb-2 line-clamp-2">
                {product.name}
              </h3>
            </div>

            {/* Price and Add to Cart */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product?.original_price !== product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product?.original_price?.toFixed(2)}
                  </span>
                )}
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-200 shrink-0 h-10 sm:h-9 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {product.in_stock ? "Add to Cart" : "Out of Stock"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
