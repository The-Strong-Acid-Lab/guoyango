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

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: ProductCardProps["product"]) => void;
}

export interface OrderItem {
  id: string;
  price_each: number;
  product: Partial<Product>;
  quantity: number;
  total_price: number;
}

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

export interface Order {
  id: string;
  created_at: string;
  order_items: OrderItem[];
  total_amount: number;
  status: string;
  total_amount_in_cny: number;
  total_amount_in_cad: number;
  rate: number;
  rate_usd_cad: number;
  payment_method: string;
  tracking_no: string;
  shipping_address: Partial<ShippingAddress>;
}
