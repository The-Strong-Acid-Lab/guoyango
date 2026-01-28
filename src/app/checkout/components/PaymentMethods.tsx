import React, { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import amplitude from "@/app/amplitude";

export type PaymentTypes = "wechat" | "alipay" | "etransfer" | "manually";

export interface PaymentMethodsProps {
  onPayment: (paymethod: PaymentTypes) => void;
  total: number;
  exchangeRateUSDToCNY: number;
  exchangeRateUSDToCAD: number;
  selectedAddressId: string;
  cartItemsAmount: number;
}

export default function PaymentMethods({
  onPayment,
  total,
  exchangeRateUSDToCNY,
  exchangeRateUSDToCAD,
  selectedAddressId,
  cartItemsAmount,
}: PaymentMethodsProps) {
  const { data: currentUser } = useAuth();

  const paymentMethods = [
    {
      id: "wechat" as PaymentTypes,
      name: "微信支付",
      icon: "/wechatpay.png",
    },
    {
      id: "alipay" as PaymentTypes,
      name: "支付宝支付",
      icon: "/alipay.png",
    },
    {
      id: "etransfer" as PaymentTypes,
      name: "e-Transfer (加拿大用户)",
      icon: "/interac.png",
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

  const errorMessage = useMemo(() => {
    if (!currentUser) {
      return "请先登录后进行支付";
    }
    if (!selectedAddressId) {
      return "请先选择邮寄地址后进行支付";
    }
    if (cartItemsAmount < 2) {
      return "至少购买2条";
    }
    return "";
  }, [currentUser, selectedAddressId, cartItemsAmount]);

  const handlePayment = (type: PaymentTypes) => {
    if (!errorMessage) {
      amplitude.track("on click payment", {
        id: currentUser?.id || "",
        paymentMethod: type,
      });
      onPayment(type);
    }
  };

  const displayConversion = useCallback(
    (type: PaymentTypes) => {
      if (type === "etransfer") {
        return `$${total.toFixed(2)}美元 ≈ $${(
          total * exchangeRateUSDToCAD
        ).toFixed(2)}加币`;
      }
      return `$${total.toFixed(2)}美元 ≈ ¥${(
        total * exchangeRateUSDToCNY
      ).toFixed(2)}人民币`;
    },
    [total, exchangeRateUSDToCNY, exchangeRateUSDToCAD],
  );

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>支付方式</CardTitle>
        <p className="text-sm text-gray-500">选择你的支付方式</p>
        {errorMessage && (
          <p className="text-base font-medium text-red-500 mt-3">
            {errorMessage}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => {
          const isWechatDisabled = method.id === "wechat";
          const isDisabled = Boolean(errorMessage) || isWechatDisabled;

          return (
            <motion.div
              key={method.id}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`relative border rounded-xl p-4 transition-all duration-200 ${
                isDisabled
                  ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                  : "relative border rounded-xl p-4 transition-all duration-200"
              }`}
              onClick={() => {
                if (isDisabled) return;
                handlePayment(method.id);
              }}
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
                        isDisabled ? "grayscale" : ""
                      }`}
                    >
                      {method.name}
                      {isWechatDisabled && (
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          (暂不可用，请联系客服)
                        </span>
                      )}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mt-2 ml-10">
                <span className="text-gray-600 text-xs sm:text-sm">
                  {displayConversion(method.id)}
                </span>
              </div>
              {method.id === "etransfer" && (
                <div className="mt-2 ml-10">
                  <span className="text-gray-600 text-xs sm:text-sm">
                    具体操作下完单查看历史订单
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
        <motion.div
          whileHover={!errorMessage ? { scale: 1.02 } : {}}
          whileTap={!errorMessage ? { scale: 0.98 } : {}}
          className="relative border rounded-xl p-4 transition-all duration-200 "
        >
          <div className="flex flex-col items-center justify-between gap-10">
            <Button
              onClick={() => handlePayment("manually")}
              className="bg-red-600 hover:bg-red-700 h-11 px-6 w-full"
              size="lg"
            >
              <div>
                <p>请先下单</p>
                <p>然后扫码联系客服，获取额外5% off</p>
              </div>
            </Button>
            <span className="text-gray-600 text-xs sm:text-sm">
              {displayConversion("manually")}
            </span>
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
