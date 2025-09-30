import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/app/components/types";
import Image from "next/image";
import amplitude from "@/app/amplitude";
import { useAuth } from "@/app/hooks/useAuth";

export interface CartSummaryProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  subtotal: number;
}

export default function CartSummary({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  subtotal,
}: CartSummaryProps) {
  const { data: currentUser } = useAuth();

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
          <span>订单详情</span>
          <span className="text-sm font-normal text-gray-500">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} 件商品
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
        {/* Cart Items */}
        <div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-64 overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <Image
                src={item.image_url}
                alt={item.name}
                width={48}
                height={48}
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain rounded-lg bg-gray-300 p-1"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-xs sm:text-sm truncate">
                  {item.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7"
                  onClick={() => {
                    onUpdateQuantity(item.id, item.quantity - 1);
                    amplitude.track("reduce amount", {
                      id: currentUser?.id || "",
                      productId: item?.id || "",
                    });
                  }}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-6 sm:w-8 text-center text-xs sm:text-sm">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7"
                  onClick={() => {
                    onUpdateQuantity(item.id, item.quantity + 1);
                    amplitude.track("increase amount", {
                      id: currentUser?.id || "",
                      productId: item?.id || "",
                    });
                  }}
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 hover:bg-red-50"
                  onClick={() => {
                    onRemoveItem(item.id);
                    amplitude.track("remove proudct", {
                      id: currentUser?.id || "",
                      productId: item?.id || "",
                    });
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">金额</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">运费</span>
            <span className="text-red-600">免运费</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-base sm:text-lg">
            <span>合计</span>
            <span className="text-red-600">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
