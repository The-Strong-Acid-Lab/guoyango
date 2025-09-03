import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

export interface ShippingAddress {
  id?: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface AddressFormProps {
  address?: ShippingAddress;
  onSave: (data: ShippingAddress) => Promise<void>;
  onCancel: () => void;
}

export default function AddressForm({
  address,
  onSave,
  onCancel,
}: AddressFormProps) {
  type FormValues = {
    full_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    is_default: boolean;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      full_name: address?.full_name || "",
      phone: address?.phone || "",
      address_line_1: address?.address_line_1 || "",
      address_line_2: address?.address_line_2 || "",
      city: address?.city || "",
      province: address?.province || "",
      postal_code: address?.postal_code || "",
      country: address?.country || "United States",
      is_default: address?.is_default || false,
    },
    mode: "onChange",
  });

  const countryValue = watch("country");
  const provinceValue = watch("province");

  const onSubmit = useCallback(
    (data: FormValues) => {
      onSave({ ...data, id: address?.id });
    },
    [onSave, address?.id]
  );

  const usStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const canadianProvinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
  ];

  const countries = [
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
  ];

  const getProvinceStates = () => {
    if (countryValue === "Canada") {
      return canadianProvinces;
    } else {
      return usStates;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>{address ? "编辑地址" : "添加新地址"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">收件人姓名 *</Label>
                <Input
                  id="full_name"
                  {...register("full_name", { required: "不能为空" })}
                  className={errors.full_name ? "border-red-500" : ""}
                />
                {errors.full_name && (
                  <span className="text-xs text-red-500">
                    {errors.full_name.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">联系电话 *</Label>
                <Input
                  id="phone"
                  {...register("phone", { required: "不能为空" })}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <span className="text-xs text-red-500">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_line_1">邮寄地址1 *</Label>
              <Input
                id="address_line_1"
                {...register("address_line_1", { required: "不能为空" })}
                className={errors.address_line_1 ? "border-red-500" : ""}
              />
              {errors.address_line_1 && (
                <span className="text-xs text-red-500">
                  {errors.address_line_1.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_line_2">邮寄地址2</Label>
              <Input
                id="address_line_2"
                {...register("address_line_2")}
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">城市 *</Label>
                <Input
                  id="city"
                  {...register("city", { required: "不能为空" })}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <span className="text-xs text-red-500">
                    {errors.city.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">州/省 *</Label>
                <Select
                  value={provinceValue}
                  onValueChange={(value) =>
                    setValue("province", value, { shouldValidate: true })
                  }
                  {...register("province", { required: "不能为空" })}
                >
                  <SelectTrigger
                    className={errors.province ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="选择 州/省" />
                  </SelectTrigger>
                  <SelectContent>
                    {getProvinceStates().map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province && (
                  <span className="text-xs text-red-500">
                    {errors.province.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">邮编 *</Label>
                <Input
                  id="postal_code"
                  {...register("postal_code", { required: "不能为空" })}
                  placeholder={countryValue === "Canada" ? "K1A 0A6" : "12345"}
                  className={errors.postal_code ? "border-red-500" : ""}
                />
                {errors.postal_code && (
                  <span className="text-xs text-red-500">
                    {errors.postal_code.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">国家 *</Label>
                <Select
                  value={countryValue}
                  onValueChange={(value) =>
                    setValue("country", value, { shouldValidate: true })
                  }
                  {...register("country", { required: "不能为空" })}
                >
                  <SelectTrigger
                    className={errors.country ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="选择国家" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <span className="text-xs text-red-500">
                    {errors.country.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={watch("is_default")}
                onCheckedChange={(checked) => setValue("is_default", !!checked)}
              />
              <Label htmlFor="is_default" className="text-sm">
                设置成默认地址
              </Label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-none"
              >
                <Check className="w-4 h-4 mr-2" />
                保存地址
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 sm:flex-none"
              >
                <X className="w-4 h-4 mr-2" />
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
