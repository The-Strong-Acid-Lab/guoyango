import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "国烟Go-北美华人专门代购国烟-品质保证 | 页面未找到",
  description:
    "国烟Go是北美华人中国香烟代购和香烟现货网站,专为北美华人代购正品国烟,支持微信、支付宝等多种付款方式,代购香烟国烟,上国烟Go,7-10天到货。美国哪里买烟,加拿大哪里买烟,湾区买烟,多伦多国烟",
  keywords: "北美国烟，正品国烟，加拿大国烟，北美买烟，美国买烟",
};

export default async function NotFound() {
  return (
    <div className="flex flex-col items-center mt-20 h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404 - 页面未找到</h1>
      <p className="text-gray-600 mb-6">您访问的页面不存在。</p>
      <Link href="/" className="text-red-500 hover:underline">
        返回首页
      </Link>
    </div>
  );
}
