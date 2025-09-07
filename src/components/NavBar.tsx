"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
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

export const NavBar = () => {
  const router = useRouter();
  const navigation = [{ name: "联系我们", href: "/" }];
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: currentUser, refetch } = useAuth();

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
    await supabase.auth.signOut();
    await refetch();
    router.push("/");
  }, [refetch, router]);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                国烟Go
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-end mr-8">
              <nav className="flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-red-600 h-9 w-9"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-red-600 h-9 w-9"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 h-12 w-12"
                  >
                    <User className="h-5 w-5" />
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
                  className="relative text-gray-600 hover:text-red-600 h-9 w-9"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile menu button and cart */}
            <div className="md:hidden flex items-center space-x-2">
              <Link href="/checkout">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 h-10 w-10"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 h-10 w-10"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 bg-white">
              <div className="flex flex-col space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-3 text-base font-medium rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex items-center justify-center space-x-1 px-3 py-3 border-t border-gray-100 mt-2 pt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 h-12 w-12"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 h-12 w-12"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-600 hover:text-red-600 hover:bg-red-50 h-12 w-12"
                      >
                        <User className="h-5 w-5" />
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
                              onClick={() => handleIconClick("manageAddresses")}
                            >
                              管理收货地址
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleIconClick("orders")}
                            >
                              历史订单
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleLogout}>
                            退出
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => setShowAuthModal(true)}
                          >
                            注册/登录
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
