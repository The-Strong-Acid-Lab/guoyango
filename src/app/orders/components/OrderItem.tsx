import React, { useCallback, useState } from "react";
import { Package, Calendar, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import Image from "next/image";
import { Order } from "@/app/components/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigationParams } from "@/app/stores/navigationParams";
import { useRouter } from "next/navigation";

interface OrderItemProps {
  order: Order;
  index: number;
}

export const OrderItem = ({ order, index }: OrderItemProps) => {
  const router = useRouter();
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [toAlipay, setToAlipay] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "已寄到";
      case "shipped":
        return "已发货";
      case "pending":
        return "待付款";
      case "expired":
        return "已结束（未付款）";
      case "paid":
        return "待发货";
      default:
        return "";
    }
  };

  const continueToPay = useCallback(async (order: Order) => {
    if (order.status === "pending") {
      if (order.payment_method === "alipay") {
        setIsLoadingPayment(true);
        const { data, error } = await supabase.functions.invoke("alipay-qr", {
          body: {
            order_id: order.id,
            shipping_address_id: order.shipping_address.id,
            items: order.order_items.map((i) => ({
              product_id: i.product.id,
              quantity: i.quantity,
            })),
            total_amount: order.total_amount,
            rate: order.rate,
            total_amount_in_cny: order.total_amount_in_cny,
          },
        });
        if (!error) {
          console.log("data", data);
          window.location.href = data.url;
        } else {
          console.log("error", error);
          toast.success("下单失败");
        }
        setIsLoadingPayment(false);
        setToAlipay(true);
      }
      if (order.payment_method === "wechat") {
        setIsLoadingPayment(true);
        const { data, error } = await supabase.functions.invoke(
          "wechatpay-qr",
          {
            body: {
              order_id: order.id,
              shipping_address_id: order.shipping_address.id,
              items: order.order_items.map((i) => ({
                product_id: i.product.id,
                quantity: i.quantity,
              })),
              total_amount: order.total_amount,
              rate: order.rate,
              total_amount_in_cny: order.total_amount_in_cny,
            },
          }
        );
        if (!error) {
          console.log("data", data);
          useNavigationParams
            .getState()
            .setParams({ wechatURL: data.code_url });
        } else {
          console.log("error", error);
          toast.success("下单失败");
        }
        setIsLoadingPayment(false);
      }
    }
  }, []);

  return (
    <motion.div
      key={order.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 gap-2">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">
                  订单号 #{order.id}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </div>

          {order.status === "pending" && (
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 flex-1 h-10 sm:h-16 text-base mt-4"
              onClick={() => continueToPay(order)}
              disabled={isLoadingPayment || toAlipay}
            >
              {isLoadingPayment && toAlipay && (
                <Loader2Icon className="animate-spin" />
              )}
              {toAlipay ? "正在跳转支付宝" : "继续付款"}
            </Button>
          )}
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pt-0">
          <div className="space-y-4 sm:space-y-6">
            {/* Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">购买商品</h4>
              <div className="space-y-3">
                {order.order_items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3">
                    <Image
                      src={item.product.image_url || ""}
                      alt={item.product.name || ""}
                      width={48}
                      height={48}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg bg-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                        {item.product.name}
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-500">
                        数量： {item.quantity} × ${item.price_each.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm sm:text-base">
                        ${item.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Pricing */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">订单信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between font-semibold text-base">
                    <span>合计：</span>
                    <div className="flex flex-col items-end">
                      <span className="text-emerald-600">
                        ${order.total_amount.toFixed(2)}
                      </span>
                      <span className="text-gray-500">
                        ≈ ¥{order.total_amount_in_cny.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">支付方式：</span>
                    <div className="flex flex-row gap-2">
                      <Image
                        src={
                          order?.payment_method === "alipay"
                            ? "/alipay.png"
                            : "/wechatpay.png"
                        }
                        alt={order?.payment_method}
                        width={24}
                        height={24}
                      />
                      <span className="font-medium">
                        {order?.payment_method === "alipay"
                          ? "支付宝支付"
                          : "微信支付"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">收货地址</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-medium">
                      {order.shipping_address.full_name}
                    </p>
                    <p>{order.shipping_address.address_line_1}</p>
                    {order.shipping_address.address_line_2 && (
                      <p>{order.shipping_address.address_line_2}</p>
                    )}
                    <p>
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.province},{" "}
                      {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {order?.tracking_no && (
              <>
                <Separator />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-blue-900">快递单号</p>
                      <p className="text-sm text-blue-700">
                        {order?.tracking_no}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() =>
                        window.open(
                          `https://www.trackingmore.com/track/en/${order.tracking_no}`,
                          "_blank"
                        )
                      }
                    >
                      查看物流
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => router.push("/contactUs")}
              >
                帮助
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
