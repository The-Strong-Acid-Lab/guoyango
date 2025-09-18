"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { CartItem, Product } from "@/app/components/types";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import ProductInfoAccordion from "./components/ProductInfoAccordion";
import RelatedProducts from "./components/RelatedProducts";
import { toast } from "sonner";

export default function ProductDetail() {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId);
      if (!error) {
        setProduct(data[0]);
      }
      setLoading(false);
    };

    loadProduct();
  }, [productId]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: CartItem) => item.id === product?.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-square bg-gray-200 rounded-xl sm:rounded-2xl animate-pulse"></div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountPercent = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="mb-6 sm:mb-8 hover:bg-red-50 hover:text-red-700 h-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        回到首页
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 sm:mb-8">
        {/* Product Images */}
        <div className="space-y-3 sm:space-y-4 flex justify-center items-center">
          <motion.div
            className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Image
              src={product.image_url}
              alt={product.name}
              width={480}
              height={480}
              className="object-contain w-100 sm:w-120 h-80 sm:h-120"
            />
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-8">
          {/* Badge and Category */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Badge
              variant="outline"
              className="text-red-700 border-red-200 bg-red-50 w-fit"
            >
              {product.brand}
            </Badge>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-50 hover:text-red-700 h-9 w-9"
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  toast.success("已复制当前链接！");
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Name */}
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {product.name}
          </motion.h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < Math.floor(product?.rating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              {product.rating > 0 && (
                <span className="text-sm sm:text-base text-gray-600">
                  ({product.rating}) • 127 reviews
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:space-x-3">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center space-x-2">
              {product?.original_price !== product.price && (
                <>
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    ${product?.original_price?.toFixed(2)}
                  </span>
                  <Badge className="bg-red-500">-{discountPercent}%</Badge>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-4">
            <span className="font-medium text-gray-900">数量</span>
            <div className="flex items-center border border-gray-200 rounded-lg w-fit">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-r-none h-10 w-10"
              >
                -
              </Button>
              <span className="w-12 text-center font-medium py-2">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-l-none h-10 w-10"
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={() => addToCart()}
            disabled={!product.in_stock}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base sm:text-lg rounded-xl h-12 sm:h-14"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.in_stock ? "加入购物车" : "售罄"}
          </Button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
            <div className="text-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-red-600 mb-2" />
              <span className="text-xs sm:text-sm text-gray-600">支付安全</span>
            </div>
            <div className="text-center">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-red-600 mb-2" />
              <span className="text-xs sm:text-sm text-gray-600">极速物流</span>
            </div>
            <div className="text-center">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-red-600 mb-2" />
              <span className="text-xs sm:text-sm text-gray-600">
                支持退款*
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info Accordion */}
      <div className="mb-12 sm:mb-16 mt-12">
        <ProductInfoAccordion />
      </div>

      {/* Reviews */}
      {/* <div className="mb-12 sm:mb-16">
        <ReviewsList />
      </div> */}

      {/* Related Products */}
      <RelatedProducts currentProduct={product} onAddToCart={addToCart} />
    </div>
  );
}
