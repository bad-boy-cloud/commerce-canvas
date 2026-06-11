export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  location: string;
  createdAt: string;
}

export interface LocationCoords {
  lat: number;
  lng: number;
  name?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = 'All' | 'Electronics' | 'Fashion' | 'Home' | 'Other';

export const KENYA_CITIES = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Other'];

export interface DeliveryArea {
  name: string;
  distance: number; // in KM
}

export const KAMAKIS_DELIVERY_DISTANCES: DeliveryArea[] = [
  { name: 'Kamakis / Northlands', distance: 0 },
  { name: 'Ruiru Town', distance: 5 },
  { name: 'Juja', distance: 12 },
  { name: 'Thika', distance: 20 },
  { name: 'Nairobi CBD', distance: 25 },
  { name: 'Kiambu Town', distance: 15 },
  { name: 'Westlands', distance: 28 },
  { name: 'Karen / Langata', distance: 40 },
  { name: 'Machakos', distance: 60 },
  { name: 'Naivasha', distance: 100 },
  { name: 'Nakuru', distance: 175 },
  { name: 'Nanyuki', distance: 190 },
  { name: 'Meru', distance: 225 },
  { name: 'Kericho', distance: 270 },
  { name: 'Eldoret', distance: 325 },
  { name: 'Kisumu', distance: 360 },
  { name: 'Mombasa', distance: 490 },
  { name: 'Malindi', distance: 570 },
];

export const DELIVERY_BASE_FEE = 200;
export const DELIVERY_PER_KM_FEE = 30;
export const KAMAKIS_COORDS = { lat: -1.168128, lng: 36.963428 };

export const MAX_FREE_DISTANCE = 2; // KM

export const CONTACT_NUMBER = '0717781932';
export const CONTACT_NUMBER_INT = '+254717781932';
export const MPESA_INSTRUCTIONS = 'To pay, send the total amount to M-Pesa number: 0717781932';
