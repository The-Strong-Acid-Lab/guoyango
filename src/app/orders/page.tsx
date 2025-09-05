"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useOrder } from "../hooks/useOrder";
import Image from "next/image";

export default function Orders() {
  const router = useRouter();
  const { data: currentUser, isLoading: isLoadingAuth } = useAuth();
  const { data: orders, isLoading: isLoadingOrders } = useOrder(
    currentUser?.id
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const loading = useMemo(
    () => isLoadingAuth || isLoadingOrders,
    [isLoadingAuth, isLoadingOrders]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "pending":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil((orders?.length || 0) / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders?.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-emerald-50 hover:text-emerald-700 h-10 w-10 p-0 sm:w-auto sm:px-4"
          >
            <ArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">返回</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-row w-full">
        <div className="flex flex-1 flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            订单历史
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 hidden sm:block">
            查看历史订单
          </p>
        </div>

        <div className="text-sm text-gray-500">共{orders?.length || 0}单</div>
      </div>

      {/* Orders */}
      <div className="space-y-6 mt-6">
        {currentOrders?.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              还没有任何订单
            </h3>
            <p className="text-gray-500 mb-6">您会看到所有历史订单</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              开始购物
            </Button>
          </div>
        ) : (
          currentOrders?.map((order, index) => (
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
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="px-4 sm:px-6 pt-0">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        购买商品
                      </h4>
                      <div className="space-y-3">
                        {order.order_items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center gap-3"
                          >
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
                                数量： {item.quantity} × $
                                {item.price_each.toFixed(2)}
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
                        <h4 className="font-medium text-gray-900 mb-3">
                          订单信息
                        </h4>
                        <div className="space-y-2 text-sm">
                          {/* <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>${order.total_amount.toFixed(2)}</span>
                          </div> */}
                          {/* <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span
                              className={
                                order.shipping === 0 ? "text-emerald-600" : ""
                              }
                            >
                              {order.shipping === 0
                                ? "FREE"
                                : `$${order.shipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax:</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div> */}
                          {/* <Separator /> */}
                          <div className="flex justify-between font-semibold text-base">
                            <span>合计：</span>
                            <span className="text-emerald-600">
                              ${order.total_amount.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Payment Method */}
                        {/* <div className="mt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">支付方式：</span>
                            <span className="font-medium">
                              {order?.payment_method || "12312"}
                            </span>
                          </div>
                        </div> */}
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          收货地址
                        </h4>
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
                              {order.shipping_address.province}{" "}
                              {order.shipping_address.postal_code}
                            </p>
                            <p>{order.shipping_address.country}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Information */}
                    {/* {order.tracking_number && (
                      <>
                        <Separator />
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-blue-900">
                                Tracking Number
                              </p>
                              <p className="text-sm text-blue-700">
                                {order?.tracking_number}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              Track Package
                            </Button>
                          </div>
                        </div>
                      </>
                    )} */}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        帮助
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 ${
                    currentPage === pageNumber
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Page Info */}
      <div className="text-center text-sm text-gray-500 mt-4">
        {startIndex + 1}-{Math.min(endIndex, orders?.length || 0)} of{" "}
        {orders?.length || 0}
      </div>
    </div>
  );
}
