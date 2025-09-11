"use client";

import { motion } from "framer-motion";
import { ProductFilters } from "./components/ProductFilters";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "./components/ProductCard";
import { supabase } from "@/lib/supabase";
import { debounce } from "lodash";
import ProductListItem from "./components/ProductListItem";
import { Product } from "./components/types";
import { toast } from "sonner";

export default function Home() {
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (!error) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const debouncedSearch = useMemo(() => {
    return debounce(async (query: string) => {
      const { data, error } = await supabase.rpc("search_products", {
        p_query: query,
        p_sort: sortBy,
      });
      if (!error) {
        setProducts(data);
      }
    }, 500);
  }, [sortBy]);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch, sortBy]);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: Product) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("加入购物车成功");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="h-32 sm:h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-3 sm:p-6 space-y-2 sm:space-y-3">
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center mb-8 sm:mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4"
        >
          国烟Go
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4"
        >
          正品国烟，北美直达，品质保证
        </motion.p>
      </div>

      <ProductFilters
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        totalProducts={products.length}
      />

      {displayMode === "grid" ? (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <ProductCard product={product} onAddToCart={addToCart} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div layout className="space-y-3 sm:space-y-4">
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
