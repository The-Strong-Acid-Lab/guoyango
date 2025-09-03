import React from "react";
import {
  Truck,
  RotateCcw,
  CreditCard,
  Shield,
  Clock,
  Package,
} from "lucide-react";
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
            <span>Delivery Information</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Standard Delivery</p>
                <p className="text-xs text-gray-600">3-5 business days • ¥50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Express Delivery</p>
                <p className="text-xs text-gray-600">
                  1-2 business days • ¥120
                </p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">
              <strong>Free shipping</strong> on orders over ¥500 within mainland
              China
            </p>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Orders placed before 2:00 PM are processed the same day</p>
            <p>• Tracking information will be sent via SMS and email</p>
            <p>• Delivery to remote areas may take 1-2 additional days</p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="returns">
        <AccordionTrigger className="flex items-center gap-2 hover:no-underline">
          <div className="flex flex-row justify-center items-center gap-4">
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span>Return & Refund Policy</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>30-day return policy</strong> - Return unused items in
              original packaging
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">Return Process</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Contact our customer service within 30 days</li>
                <li>Receive return authorization and shipping label</li>
                <li>Pack item securely in original packaging</li>
                <li>Drop off at any authorized shipping location</li>
                <li>Refund processed within 5-7 business days</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Return Conditions</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Items must be unused and in original condition</li>
                <li>Original packaging and tags must be included</li>
                <li>
                  Return shipping costs covered by customer unless defective
                </li>
                <li>Personalized items cannot be returned</li>
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="payment">
        <AccordionTrigger className="flex items-center gap-2 hover:no-underline">
          <div className="flex flex-row justify-center items-center gap-4">
            <CreditCard className="w-4 h-4 text-red-600" />
            <span>Payment Methods</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-xl">💬</div>
              <div>
                <p className="font-medium text-sm">WeChat Pay</p>
                <p className="text-xs text-gray-600">Secure mobile payment</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-xl">🅰️</div>
              <div>
                <p className="font-medium text-sm">Alipay</p>
                <p className="text-xs text-gray-600">Fast & secure payment</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <Shield className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700">
              All payments are encrypted and secure. Your payment information is
              never stored.
            </p>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Payment is processed immediately upon order confirmation</p>
            <p>• You will receive an email receipt after successful payment</p>
            <p>• For payment issues, contact our customer service team</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
