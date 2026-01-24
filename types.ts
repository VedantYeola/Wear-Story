export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  tags: string[];
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum View {
  HOME = 'HOME',
  PRODUCT_DETAILS = 'PRODUCT_DETAILS',
  CHECKOUT = 'CHECKOUT'
}