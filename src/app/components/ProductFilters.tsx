import { Search, Grid, List, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ProductFiltersProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  displayMode: "grid" | "list";
  onDisplayModeChange: (mode: "grid" | "list") => void;
  totalProducts: number;
  filters: string[];
  removeFilter: (filter: string) => void;
}

export const ProductFilters = ({
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  displayMode,
  onDisplayModeChange,
  totalProducts,
  filters,
  removeFilter,
}: ProductFiltersProps) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="pt-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-4">
        <div className="flex flex-col gap-3">
          <div className="relative w-full sm:w-128">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="搜索商品..."
              value={searchQuery}
              onChange={(e) => {
                e.preventDefault();
                onSearchChange(e.target.value);
              }}
              className="pl-9 w-full sm:w-128"
            />
          </div>
          <span className="text-sm text-gray-500 ml-3 sm:text-left sm:whitespace-nowrap">
            共{totalProducts}款商品符合条件
          </span>
        </div>

        <div className="flex flex-row items-stretch items-start gap-4">
          <div className="flex items-center justify-center p-1 bg-gray-100 rounded-lg w-fit mx-auto sm:mx-0">
            <Button
              variant={displayMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => onDisplayModeChange("grid")}
              className={`w-9 h-9 ${
                displayMode === "grid" && "bg-white shadow-sm"
              }`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={displayMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => onDisplayModeChange("list")}
              className={`w-9 h-9 ${
                displayMode === "list" && "bg-white shadow-sm"
              }`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-1 flex-col sm:flex-row items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto text-sm border border-gray-200 rounded-lg px-3 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {/* <option value="popularity">最受欢迎</option> */}
              <option value="price_asc">价格：低到高</option>
              <option value="price_desc">价格：高到低</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3 flex-wrap">
        {filters.map((filter, i) => {
          return (
            <div
              key={i}
              className="bg-black rounded-sm flex px-2 py-1 items-center gap-x-2"
            >
              <p className="text-white text-sm">{filter}</p>
              <X
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter(filter);
                }}
                className="cursor-pointer text-white w-4 h-4"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
