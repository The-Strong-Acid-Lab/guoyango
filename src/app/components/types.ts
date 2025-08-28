export interface Product {
  id: string;
  name: string;
  image_url: string;
  price: number;
  original_price?: number;
  rating?: number;
  brand: string;
  in_stock: boolean;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: ProductCardProps["product"]) => void;
}
