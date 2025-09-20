"use client";

import { motion } from "framer-motion";
import { ProductFilters } from "./components/ProductFilters";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductCard from "./components/ProductCard";
import { supabase } from "@/lib/supabase";
import { debounce } from "lodash";
import ProductListItem from "./components/ProductListItem";
import { Product } from "./components/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pageSize = 12;

export default function Home() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("price_desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filters, setFilters] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);

  const addFilters = useCallback(
    (brand: string) => {
      const brandFilters = new Set(filters);
      brandFilters.add(brand);
      setFilters(Array.from(brandFilters));
    },
    [filters]
  );

  const removeFilter = useCallback(
    (brand: string) => {
      const brandFilters = new Set(filters);
      brandFilters.delete(brand);
      setFilters(Array.from(brandFilters));
    },
    [filters]
  );

  const debouncedSearch = useMemo(() => {
    return debounce(async (query: string) => {
      setLoading(true);
      let productsQuery = supabase
        .from("products")
        .select(
          "id, image_url, price, original_price, brand, in_stock, name, created_at",
          { count: "exact" }
        )
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order("price", { ascending: sortBy === "price_asc" });

      if (filters.length > 0) {
        productsQuery = productsQuery.in("brand", filters);
      }
      const { data, count, error } = await productsQuery;

      if (!error) {
        setTotalPages(Math.ceil((count || 0) / pageSize));
        setProducts(data);
        setTotal(count || 0);
      }
      setLoading(false);
    }, 500);
  }, [sortBy, page, filters]);

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

  const pagination = useCallback(() => {
    return (
      <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12">
        {/* Previous Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">上一页</span>
        </Button>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          {(() => {
            const range: (number | string)[] = [];

            if (totalPages <= 5) {
              range.push(
                ...Array.from({ length: totalPages }, (_, i) => i + 1)
              );
            } else if (page <= 3) {
              range.push(1, 2, 3, 4, "...", totalPages);
            } else if (page >= totalPages - 2) {
              range.push(
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
              );
            } else {
              range.push(1, "...", page - 1, page, page + 1, "...", totalPages);
            }

            return range.map((p, idx) => {
              if (p === "...") {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }

              const pageNumber = p as number;
              const isActive = page === pageNumber;

              return (
                <Button
                  key={pageNumber}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNumber)}
                  className={`w-10 h-10 transition-colors duration-150 ${
                    isActive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "hover:bg-red-50 hover:text-red-700"
                  }`}
                >
                  {pageNumber}
                </Button>
              );
            });
          })()}
        </div>

        {/* Next Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">下一页</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }, [page, totalPages]);

  const renderContent = useCallback(() => {
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
    return displayMode === "grid" ? (
      <>
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
              <ProductCard
                product={product}
                onAddToCart={addToCart}
                onClickBrand={(brand) => addFilters(brand)}
              />
            </motion.div>
          ))}
        </motion.div>
        {pagination()}
      </>
    ) : (
      <>
        <motion.div layout className="space-y-3 sm:space-y-4">
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onClickBrand={(brand) => addFilters(brand)}
            />
          ))}
        </motion.div>
        {pagination()}
      </>
    );
  }, [displayMode, loading, products, pagination, addFilters]);

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
        totalProducts={total}
        filters={filters}
        removeFilter={(filter) => removeFilter(filter)}
      />

      {renderContent()}
    </div>
  );
}
