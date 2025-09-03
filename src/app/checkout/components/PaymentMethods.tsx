import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export interface PaymentMethodsProps {
  onPayment: (paymethod: "wechat" | "alipay") => void;
}

export default function PaymentMethods({ onPayment }: PaymentMethodsProps) {
  const paymentMethods = [
    {
      id: "wechat",
      name: "微信支付",
      icon: "💬",
      description: "Pay securely with WeChat",
      popular: true,
    },
    {
      id: "alipay",
      name: "支付宝",
      icon: "🅰️",
      description: "Pay with Alipay",
      popular: true,
    },
  ];

  const handlePayment = (id: "wechat" | "alipay") => {
    onPayment(id);
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative border rounded-xl p-4 cursor-pointer transition-all duration-200"
            onClick={() => handlePayment(method.id as "wechat" | "alipay")}
          >
            {method.popular && (
              <Badge className="absolute -top-2 left-4 bg-red-500 text-white text-xs">
                热门
              </Badge>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{method.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
