"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/app/components/types";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/app/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const NavBar = () => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: currentUser } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(
      cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
    );

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(
        updatedCart.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        )
      );
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const handleIconClick = useCallback(
    (screen: string) => {
      if (!!currentUser) {
        router.push(`/${screen}`);
      } else {
        setShowAuthModal(true);
      }
    },
    [currentUser, router]
  );

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.location.reload();
      router.push("/");
    } else {
      toast.error("退出失败");
    }
  }, [router, queryClient]);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                国烟Go
              </h1>
            </Link>

            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 h-12 w-12"
                  >
                    <User className="!h-6 !w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>
                    {!!currentUser ? "欢迎" : "我的账号"}
                  </DropdownMenuLabel>
                  {!!currentUser ? (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleIconClick("profile")}
                        >
                          我的账号
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleIconClick("orders")}
                        >
                          历史订单
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleIconClick("manageAddresses")}
                        >
                          管理收货地址
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        退出
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setShowAuthModal(true)}>
                        注册/登录
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/checkout">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 hover:text-red-600 hover:bg-red-50 h-12 w-12"
                >
                  <ShoppingBag className="!h-6 !w-6" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-base bg-red-500">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
