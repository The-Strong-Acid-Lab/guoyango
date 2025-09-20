import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Product } from "@/app/components/types";
import ProductCard from "@/app/components/ProductCard";
import { useRelatedProducts } from "@/app/hooks/useRelatedProducts";

export interface RelatedProductsProps {
  currentProduct: Product;
  onAddToCart: (product: Product) => void;
}

export default function RelatedProducts({
  currentProduct,
  onAddToCart,
}: RelatedProductsProps) {
  // const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadRelatedProducts = async () => {
  //     setLoading(true);
  //     try {
  //       const { data, error } = await supabase.from("products").select("*");
  //       if (!error) {
  //         setRelatedProducts(data);
  //       }
  //     } catch (error) {
  //       console.error("Error loading related products:", error);
  //     }
  //     setLoading(false);
  //   };

  //   loadRelatedProducts();
  // }, [currentProduct]);

  const { data: relatedProducts, isLoading } = useRelatedProducts(
    currentProduct?.brand
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          相关推荐
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <div className="h-32 sm:h-40 bg-gray-200 animate-pulse"></div>
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">相关推荐</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProducts?.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
