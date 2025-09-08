"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CartItem } from "../components/types";
import CartSummary from "./components/CartSummary";
import PaymentMethods from "./components/PaymentMethods";
import ShippingAddressSelector from "./components/ShippingAddressSelector";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [exchangeRate, setExchangeRate] = useState(7.14);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const { data: currentUser } = useAuth();

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

  const removeItem = useCallback(
    (itemId: string) => {
      const updatedCart = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    },
    [cartItems]
  );

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleAlipay = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke("alipay-qr", {
      body: {
        shipping_address_id: selectedAddressId,
        items: cartItems.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
        })),
        total_amount: subtotal,
        rate: exchangeRate,
        total_amount_in_cny: Number((subtotal * exchangeRate).toFixed(2)),
      },
    });
    if (!error) {
      setCartItems([]);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      window.location.href = data.url;
      window.scrollTo(0, 0);
      setIsLoadingPayment(true);
    } else {
      console.log("error", error);
      toast.success("下单失败");
    }
  }, [cartItems, exchangeRate, selectedAddressId, subtotal]);

  const handlePayment = useCallback(
    async (id: string) => {
      if (id === "alipay") {
        await handleAlipay();
      }
      if (id === "wechat") {
      }
    },
    [handleAlipay]
  );

  useEffect(() => {
    const convertCurrency = async () => {
      const res = await fetch(
        "https://api.currencyapi.com/v3/latest?apikey=cur_live_kCWYFqYrLj5fdL0iZg1ybGCLa52LS1SqYkYyaG1B"
      );
      const results = await res.json();
      setExchangeRate(results.data["CNY"].value);
    };
    convertCurrency();
  }, []);

  if (isLoadingPayment) {
    return (
      <div className="min-h-screen flex mt-50 justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">正在跳转支付页面</p>
        </div>
      </div>
    );
  }

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
                onClick={() => router.back()}
                className="hover:bg-red-50 hover:text-red-700 h-10 w-10 p-0 sm:w-auto sm:px-4"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">返回</span>
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
              <PaymentMethods
                onPayment={handlePayment}
                total={subtotal}
                exchangeRate={exchangeRate}
                disabled={!selectedAddressId || !currentUser}
              />
            </div>

            {/* Cart Summary */}
            <div className="order-1 lg:order-2">
              <CartSummary
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                subtotal={subtotal}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
