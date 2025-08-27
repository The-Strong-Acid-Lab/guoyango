"use client";

import { motion } from "framer-motion";
import { ProductFilters } from "./components/ProductFilters";
import { useState } from "react";

export default function Home() {
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
  const [products] = useState(["123"]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center mb-8 sm:mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4"
        >
          国烟Go优选代购
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
    </div>
  );
}
