"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContactUs() {
  const router = useRouter();
  const wechatId = "guoyango888";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wechatId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.log(e);
      setCopied(false);
    }
  };

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

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        联系我们
      </h1>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
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
        <div className="text-gray-500 text-sm mt-2">
          扫码添加微信，获取更多优惠
        </div>
      </div>
    </div>
  );
}
