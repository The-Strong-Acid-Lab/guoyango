"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useOrder } from "../hooks/useOrder";
import { useNavigationParams } from "../stores/navigationParams";
import WeChatPayModal from "../checkout/components/WeChatPayModal";
import { OrderItem } from "./components/OrderItem";

export default function Orders() {
  const router = useRouter();
  const { data: currentUser, isLoading: isLoadingAuth } = useAuth();
  const { data: orders, isLoading: isLoadingOrders } = useOrder(
    currentUser?.id
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const { params } = useNavigationParams();

  const [showWeChatModal, setShowWeChatModal] = useState(false);
  const [wechatPaymentUrl, setWechatPaymentUrl] = useState("");

  useEffect(() => {
    if (params.wechatURL) {
      setWechatPaymentUrl(params.wechatURL as string);
      setShowWeChatModal(true);
    }
  }, [params.wechatURL]);

  const loading = useMemo(
    () => isLoadingAuth || isLoadingOrders,
    [isLoadingAuth, isLoadingOrders]
  );

  // Calculate pagination
  const totalPages = Math.ceil((orders?.length || 0) / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders?.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWeChatClose = useCallback(() => {
    setShowWeChatModal(false);
    useNavigationParams.getState().setParams({ wechatURL: "" });
    window.location.reload();
  }, []);

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
              className="bg-red-600 hover:bg-red-700"
            >
              开始购物
            </Button>
          </div>
        ) : (
          currentOrders?.map((order, index) => (
            <OrderItem order={order} index={index} key={index} />
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
            <span className="hidden sm:inline">上一页</span>
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
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "hover:bg-red-50 hover:text-red-700"
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
            <span className="hidden sm:inline">下一页</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Page Info */}
      <div className="text-center text-sm text-gray-500 mt-4">
        {startIndex + 1}-{Math.min(endIndex, orders?.length || 0)} of{" "}
        {orders?.length || 0}
      </div>

      <WeChatPayModal
        isOpen={showWeChatModal}
        onClose={handleWeChatClose}
        paymentUrl={wechatPaymentUrl}
      />
    </div>
  );
}
