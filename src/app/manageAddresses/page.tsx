"use client";

import React, { useCallback, useMemo, useState } from "react";
import { ArrowLeft, Plus, MapPin, Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import AddressForm, { ShippingAddress } from "./components/AddressForm";
import { toast } from "sonner";
import { useShippingAddress } from "../hooks/useShippingAddress";
import { useAddShippingAddress } from "../hooks/useAddShippingAddress";
import { useUpdateShippingAddress } from "../hooks/useUpdateShippingAddress";
import { useDeleteShippingAddress } from "../hooks/useDeleteShippingAddress";

export default function ManageAddresses() {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    ShippingAddress | undefined
  >(undefined);
  const { data: currentUser, isLoading: isLoadingAuth } = useAuth();
  const router = useRouter();
  const { data: addresses, isLoading: isLoadingShippingAddresses } =
    useShippingAddress(currentUser?.id);
  const addAddress = useAddShippingAddress(currentUser?.id);
  const updateAddress = useUpdateShippingAddress();
  const deleteAddress = useDeleteShippingAddress();

  const isLoading = useMemo(() => {
    return isLoadingAuth || isLoadingShippingAddresses;
  }, [isLoadingAuth, isLoadingShippingAddresses]);

  const onSaveAddress = useCallback(
    async (data: ShippingAddress) => {
      try {
        if (currentUser?.id) {
          if (data.id) {
            try {
              await updateAddress.mutateAsync({ ...data });
              toast.success("修改地址成功");
            } catch {
              toast.error("修改地址失败");
            }
          } else {
            try {
              await addAddress.mutateAsync({ ...data });
              toast.success("添加地址成功");
            } catch {
              toast.error("添加地址失败");
            }
          }
        }
        setShowForm(false);
        setEditingAddress(undefined);
      } catch (error) {
        console.error("Error saving address:", error);
      }
    },
    [currentUser?.id, addAddress, updateAddress]
  );

  const onDeleteAddress = useCallback(
    async (addressId: string) => {
      try {
        await deleteAddress.mutateAsync(addressId);
        toast.success("删除地址成功");
      } catch {
        toast.error("删除地址失败");
      }
    },
    [deleteAddress]
  );

  const setDefaultAddress = useCallback(
    async (addressId: string) => {
      try {
        try {
          await updateAddress.mutateAsync({ id: addressId, is_default: true });
          toast.success("设置该地址为默认成功");
        } catch {
          toast.error("设置该地址为默认失败");
        }
      } catch (error) {
        console.error("Error setting default address:", error);
      }
    },
    [updateAddress]
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
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
            className="hover:bg-red-50 hover:text-red-700 h-10 w-10 p-0 sm:w-auto sm:px-4"
          >
            <ArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">返回</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-row items-center">
        <div className="flex flex-1 flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            收货地址
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 hidden sm:block">
            管理你的地址
          </p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加邮寄地址
        </Button>
      </div>

      {/* Address Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="my-6"
          >
            <AddressForm
              address={editingAddress}
              onSave={onSaveAddress}
              onCancel={() => {
                setShowForm(false);
                setEditingAddress(undefined);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses?.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              还没有邮寄地址
            </h3>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-red-600 hover:bg-red-700 mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加邮寄地址
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 mt-6">
            {addresses?.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`border-none shadow-lg ${
                    address.is_default ? "ring-2 ring-gray-500" : ""
                  }`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-semibold text-gray-900">
                            {`地址 ${index + 1}`}
                          </h3>
                          {address.is_default && (
                            <Badge className="bg-gray-100 text-gray-700">
                              默认
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="font-medium text-gray-900">
                            {address.full_name}
                          </p>
                          {address.phone && <p>{address.phone}</p>}
                          <p>{address.address_line_1}</p>
                          {address.address_line_2 && (
                            <p>{address.address_line_2}</p>
                          )}
                          <p>
                            {address.city}, {address.province}{" "}
                            {address.postal_code}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:items-end">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingAddress(address);
                              setShowForm(true);
                            }}
                            className="text-gray-600 border-gray-200 hover:bg-gray-50"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            修改
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteAddress(address?.id || "")}
                            className="text-gray-600 border-gray-200 hover:bg-gray-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            删除
                          </Button>
                        </div>
                        {!address.is_default && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDefaultAddress(address?.id || "")}
                            className="text-gray-600 hover:bg-gray-50"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            设置为默认
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
