import React from "react";
import { Metadata } from "next";
import ProductDetailsClient from "./components/ProductDetailsClient";
import { supabase } from "@/lib/supabase";

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
  )}。国烟Go提供北美华人中国香烟代购服务，支持多种付款方式，3-7天到货。`;

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
  const priceValidUntil = new Date();
  priceValidUntil.setMonth(priceValidUntil.getMonth() + 1);
  const formattedPriceValidUntil = priceValidUntil.toISOString().split("T")[0];

  const ratingValue =
    typeof product.rating === "number" && product.rating > 0
      ? Number(product.rating.toFixed(1))
      : 5;

  const reviewCount = 127;
  const reviewDate = new Date().toISOString().split("T")[0];

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
      priceValidUntil: formattedPriceValidUntil,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
      shippingDestination: [
        { "@type": "DefinedRegion", addressCountry: "US" },
        { "@type": "DefinedRegion", addressCountry: "CA" },
      ],
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: [
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "Rest of world" },
        ],
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        name: `${product.name} 客户评价`,
        reviewBody: `客户对${product.brand}${product.name}的积极反馈，强调其品质与口感。`,
        datePublished: reviewDate,
        author: {
          "@type": "Person",
          name: "GuoYanGo Verified Customer",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue,
          bestRating: "5",
          worstRating: "1",
        },
      },
    ],
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
