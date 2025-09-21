"use client";

import React from "react";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProfileClient() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
          我的账号
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 hidden sm:block">
          管理账号以及查看历史订单
        </p>
      </div>

      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 mt-8 sm:mt-10"
      >
        <Card className="border-none shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Oliver Sheng
                </h2>
                <p className="text-sm sm:text-base text-gray-500">
                  sryoliver@gmail.com
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  注册时间：2025-08-27
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
