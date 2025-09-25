import React from "react";
import { Metadata } from "next";
import ProductDetailsClient from "./components/ProductDetailsClient";
import { supabase } from "@/lib/supabase";
import { Product } from "@/app/components/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (!product) {
    return {
      title: "产品未找到 | 国烟Go",
      description: "抱歉，您查找的产品不存在。",
    };
  }

  const title = `${product.name} - 国烟Go`;
  const description = `购买正品${product.name}，价格$${product.price.toFixed(
    2
  )}。国烟Go提供北美华人中国香烟代购服务，支持多种付款方式，7-10天到货。`;

  return {
    title,
    description,
    keywords: `${product.name}, ${product.brand}, 北美国烟, 正品国烟, 加拿大国烟`,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.image_url,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image_url],
    },
    alternates: {
      canonical: `https://guoyango.com/product/${product.id}`,
    },
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">产品未找到</h1>
        <p className="text-gray-600">抱歉，您查找的产品不存在。</p>
      </div>
    );
  }

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image_url,
    description: `正品${product.name}，品牌：${product.brand}`,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: 10,
          reviewCount: 999999,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ProductDetailsClient />
    </>
  );
}
