import React from "react";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ProductCardProps } from "./types";

export default function ProductCard({
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <div className="relative w-full h-32 sm:h-48 group-hover:scale-105 transition-transform duration-500 ">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain rounded-lg py-2"
            />
          </div>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 hover:bg-red-500 text-xs">
              -{discountPercent}%
            </Badge>
          )}

          {/* Favorite Button - Hidden on small screens */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hidden sm:flex w-8 h-8 sm:w-10 sm:h-10"
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button> */}

          {/* Stock Status */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
              <Badge
                variant="secondary"
                className="bg-white text-gray-900 text-xs"
              >
                售罄
              </Badge>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-6">
          <div className="flex items-start justify-between mb-1 sm:mb-2">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-lg leading-tight group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </div>

          {/* Rating - Hidden on very small screens */}
          {/* <div className="flex items-center mb-2 sm:mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2 h-2 sm:w-3 sm:h-3 ${
                    i < Math.floor(product?.rating || 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1 sm:ml-2 hidden sm:inline">
              ({product?.rating || 0})
            </span>
          </div> */}

          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 truncate">
            {product.brand}
          </p>
          {/* Price */}
          <div className="flex items-center justify-between mb-3 sm:mb-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2">
              <span className="text-sm sm:text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product?.original_price !== product.price && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ¥{product?.original_price?.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-3 sm:px-6 pb-3 sm:pb-6">
        <Button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 h-8 sm:h-10 text-xs sm:text-sm"
        >
          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          加入购物车
        </Button>
      </div>
    </motion.div>
  );
}
