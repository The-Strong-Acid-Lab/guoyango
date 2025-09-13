import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

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
  const wechatId = "guoyango888";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wechatId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  };

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
        <motion.div
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          className="relative border rounded-xl p-4 transition-all duration-200 "
        >
          <div className="flex flex-col items-center justify-between gap-10">
            <div className="text-gray-500 text-sm mt-2">
              扫码联系客服，获取额外5% off
            </div>
            <Image
              src="/contactUs.JPG"
              alt="微信二维码"
              width={280}
              height={280}
              className="rounded-lg border border-gray-200 mb-4"
            />
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-700 text-lg font-medium">
                微信号：{wechatId}
              </span>
              <Button
                size="icon"
                variant="ghost"
                aria-label="复制微信号"
                onClick={handleCopy}
                className="ml-1 w-8 h-8 p-0"
              >
                <Copy className="w-5 h-5" />
              </Button>
              {copied && (
                <span className="text-green-600 text-xs ml-2">已复制</span>
              )}
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
