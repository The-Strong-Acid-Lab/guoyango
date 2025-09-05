"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CartItem } from "../components/types";
import CartSummary from "./components/CartSummary";
import PaymentMethods from "./components/PaymentMethods";
import ShippingAddressSelector from "./components/ShippingAddressSelector";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { toast } from "sonner";

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const createOrder = useCreateOrder();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handlePayment = async () => {
    // localStorage.removeItem("cart");
    // window.dispatchEvent(new Event("cartUpdated"));
    createOrder.mutate(
      {
        shipping_address_id: selectedAddressId,
        items: cartItems.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
        })),
      },
      {
        onSuccess: () => {
          toast.success("订单创建成功");
          router.push(`/`);
        },
        onError: () => {
          toast.error("订单失败");
        },
      }
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              购物车中未有商品
            </h2>
            <p className="text-gray-500 px-4">添加商品到购物车</p>
          </div>
          <Button
            onClick={() => router.push("/")}
            className="bg-red-600 hover:bg-red-700 h-11 px-6"
          >
            开始购物
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key="checkout"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="hover:bg-red-50 hover:text-red-700 h-10 w-10 p-0 sm:w-auto sm:px-4"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">继续购买</span>
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              购物车
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1 hidden sm:block">
              查看订单并完成支付
            </p>
          </div>

          {/* Checkout Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-10">
            {/* Payment Methods */}
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <ShippingAddressSelector
                selectedAddressId={selectedAddressId}
                onAddressSelect={setSelectedAddressId}
              />
              <PaymentMethods onPayment={handlePayment} />
            </div>

            {/* Cart Summary */}
            <div className="order-1 lg:order-2">
              <CartSummary
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
