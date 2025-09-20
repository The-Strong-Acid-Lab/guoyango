import React from "react";
import { Truck, RotateCcw, CreditCard } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductInfoAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="delivery">
        <AccordionTrigger className="flex items-center gap-2 hover:no-underline">
          <div className="flex flex-row justify-center items-center gap-4">
            <Truck className="w-4 h-4 text-red-600" />
            <span>物流信息</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 下单后我们会第一时间发货</p>
            <p>• 通过历史订单查看物流信息</p>
            <p>• 一般5-10天就能到货</p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="returns">
        <AccordionTrigger className="flex items-center gap-2 hover:no-underline">
          <div className="flex flex-row justify-center items-center gap-4">
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span>退款政策</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="space-y-3">
            <div>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>一般情况下无故不接受退款</li>
                <li>如果被海关扣留或者退回，可以申请退款</li>
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="payment">
        <AccordionTrigger className="flex items-center gap-2 hover:no-underline">
          <div className="flex flex-row justify-center items-center gap-4">
            <CreditCard className="w-4 h-4 text-red-600" />
            <span>支付方式</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="space-y-3">
            <div>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>直接联系客服，可以额外享受5% off</li>
                <li>微信支付</li>
                <li>支付宝支付</li>
                <li>加拿大用户支持e-Transfer</li>
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
