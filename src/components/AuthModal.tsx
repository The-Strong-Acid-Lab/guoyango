import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, User, AlertCircle, CheckCircle } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { toast } from "sonner";
import { useAuth } from "@/app/hooks/useAuth";

type AuthFormData = {
  email: string;
};

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [showOtp, setShowOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    mode: "onChange",
  });
  const { refetch } = useAuth();
  const emailValue = watch("email");

  const verifyOTP = useCallback(async () => {
    const { error } = await supabase.auth.verifyOtp({
      email: emailValue,
      token: otpValue,
      type: "email",
    });
    if (!error) {
      await refetch();
      reset();
      setOtpValue("");
      onClose();
    } else {
      toast.error("验证码错误");
    }
  }, [emailValue, otpValue, refetch, reset, onClose]);

  const sendOTP = useCallback(async (formData: AuthFormData) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: formData.email,
      options: {
        shouldCreateUser: true,
      },
    });
    if (!error) {
      toast.success("已发送验证码，请查看邮件");
      setShowOtp(true);
    } else {
      toast.error(error.message + "发送验证码失败，请联系客服");
    }
  }, []);

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
          className="relative w-full max-w-sm"
        >
          <Card className="border-none shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-2 right-2 h-8 w-8 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-xl font-bold">
                登录/创建新账号
              </CardTitle>
              <CardDescription>即刻开始购物</CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="请输入邮箱地址"
                        className={`pl-9 ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : emailValue
                            ? "border-green-500"
                            : ""
                        }`}
                        {...register("email", {
                          required: "邮箱为必填项",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "请输入有效的邮箱地址",
                          },
                        })}
                      />
                      {emailValue && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {errors.email ? (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {typeof errors.email.message === "string"
                          ? errors.email.message
                          : "邮箱为必填项"}
                      </p>
                    )}
                  </div>
                </div>

                {!showOtp && (
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white h-11 text-base font-medium sm:mt-4"
                    disabled={showOtp}
                    onClick={handleSubmit(sendOTP)}
                  >
                    发送验证码
                  </Button>
                )}
              </form>

              {showOtp && (
                <div className="space-y-4 mt-6">
                  <Label>验证码</Label>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    containerClassName="w-full justify-center"
                    onChange={setOtpValue}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-14 h-14 text-2xl" />
                      <InputOTPSlot index={1} className="w-14 h-14 text-2xl" />
                      <InputOTPSlot index={2} className="w-14 h-14 text-2xl" />
                      <InputOTPSlot index={3} className="w-14 h-14 text-2xl" />
                      <InputOTPSlot index={4} className="w-14 h-14 text-2xl" />
                      <InputOTPSlot index={5} className="w-14 h-14 text-2xl" />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white h-11 text-base font-medium sm:mt-4"
                    disabled={otpValue.length !== 6}
                    onClick={verifyOTP}
                  >
                    验证登录
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
