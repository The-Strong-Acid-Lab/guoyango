import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface WeChatPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentUrl: string;
}

export default function WeChatPayModal({
  isOpen,
  onClose,
  paymentUrl,
}: WeChatPayModalProps) {
  const [qrLoading, setQrLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (isOpen) {
      setQrLoading(true);
      setTimeLeft(300);

      // Simulate QR code loading
      const timer = setTimeout(() => {
        setQrLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, onClose]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const generateQRCodeUrl = (url: string) => {
    // Using qr-server.com API to generate QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      url
    )}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Background Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md"
        >
          <Card className="border-none shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">微信支付</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  剩余时间：{" "}
                  <span className="font-semibold">{formatTime(timeLeft)}</span>
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 text-center">
              {/* QR Code */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                  {qrLoading ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        正在生成微信支付二维码
                      </p>
                    </div>
                  ) : (
                    <Image
                      src={generateQRCodeUrl(paymentUrl)}
                      alt="WeChat Pay QR Code"
                      width={180}
                      height={180}
                      className="w-44 h-44 rounded-lg"
                    />
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  取消支付
                </Button>
              </div>
              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">🔒 此次支付安全且加密</p>
              </div>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 flex-1 h-8 sm:h-10 text-base mt-4"
                onClick={onClose}
              >
                我已经付款
              </Button>{" "}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
