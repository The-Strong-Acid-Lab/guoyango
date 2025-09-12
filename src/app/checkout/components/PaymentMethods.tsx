import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

export interface PaymentMethodsProps {
  onPayment: (paymethod: "wechat" | "alipay") => void;
  total: number;
  exchangeRate: number;
  disabled: boolean;
}

export default function PaymentMethods({
  onPayment,
  total,
  exchangeRate,
  disabled = false,
}: PaymentMethodsProps) {
  const paymentMethods = [
    {
      id: "wechat",
      name: "微信支付",
      icon: "/wechatpay.png",
    },
    {
      id: "alipay",
      name: "支付宝支付",
      icon: "/alipay.png",
    },
  ];

  const handlePayment = (id: "wechat" | "alipay") => {
    if (!disabled) {
      onPayment(id);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>支付方式</CardTitle>
        <p className="text-sm text-gray-500">选择你的支付方式</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            // className="relative border rounded-xl p-4 cursor-pointer transition-all duration-200"
            className={`relative border rounded-xl p-4 transition-all duration-200 ${
              disabled
                ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                : "relative border rounded-xl p-4 transition-all duration-200"
            }`}
            onClick={() => handlePayment(method.id as "wechat" | "alipay")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src={method.icon}
                  alt={method.name}
                  width={24}
                  height={24}
                />
                <div>
                  <h3
                    className={`font-semibold text-gray-900  ${
                      disabled ? "grayscale" : ""
                    }`}
                  >
                    {method.name}
                  </h3>
                </div>
              </div>
            </div>
            <div className="mt-2 ml-10">
              <span className="text-gray-600 text-xs sm:text-sm">{`$${total.toFixed(
                2
              )}美元 ≈ ¥${(total * exchangeRate).toFixed(2)}人民币`}</span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
