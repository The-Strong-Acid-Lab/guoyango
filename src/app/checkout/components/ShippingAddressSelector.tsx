import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Edit } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { useShippingAddress } from "@/app/hooks/useShippingAddress";

export interface ShippingAddressSelectorProps {
  selectedAddressId: string | null;
  onAddressSelect: (id: string) => void;
}

export default function ShippingAddressSelector({
  selectedAddressId,
  onAddressSelect,
}: ShippingAddressSelectorProps) {
  const { data: currentUser } = useAuth();
  const { data: addresses } = useShippingAddress(currentUser?.id);
  const defaultAddress = addresses?.find((addr) => addr.is_default);

  useEffect(() => {
    if (!selectedAddressId && defaultAddress) {
      onAddressSelect(defaultAddress?.id || "");
    }
  }, [defaultAddress, selectedAddressId, onAddressSelect]);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            <span>收货地址</span>
          </div>
          <Link href="/manageAddresses">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {addresses?.length === 0 ? (
          <div className="text-center py-6">
            <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">还未添加收货地址</p>
            <Link href="/manageAddresses">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                添加邮寄地址
              </Button>
            </Link>
          </div>
        ) : (
          <RadioGroup value={selectedAddressId} onValueChange={onAddressSelect}>
            <div className="space-y-3">
              {addresses?.map((address) => (
                <div key={address?.id} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={address?.id || ""}
                    id={address.id}
                    className="mt-1"
                  />
                  <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                    <div
                      className={`border rounded-lg p-3 w-full transition-all duration-200 ${
                        selectedAddressId === address.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {`地址 ${addresses.indexOf(address) + 1}`}
                        </h4>
                        {address.is_default && (
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                            Default
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
                          {address.city}, {address.province},{" "}
                          {address.postal_code}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}
