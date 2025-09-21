import React from "react";
import { Metadata } from "next";
import OrdersClient from "./components/OrdersClient";

export const metadata: Metadata = {
  title: "国烟Go-北美华人专门代购国烟-品质保证 | 订单",
  description:
    "国烟Go是北美华人中国香烟代购和香烟现货网站,专为北美华人代购正品国烟,支持微信、支付宝等多种付款方式,代购香烟国烟,上国烟Go,7-10天到货。美国哪里买烟,加拿大哪里买烟,湾区买烟,多伦多国烟",
  keywords: "北美国烟，正品国烟，加拿大国烟，北美买烟，美国买烟",
};

export default function Orders() {
  return <OrdersClient />;
}
