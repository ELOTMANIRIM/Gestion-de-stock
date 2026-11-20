export interface User {
  id: string;
  name: string;
  email: string;
  roles: 'admin' | 'delivery' | 'customer';
  avatar?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string
  description: string
  price: number
  stock: number
  image: File | null
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: 'vente' | 'achat';
  clientId?: string;
  clientName?: string;   // <-- new
  supplierId?: string;
  supplierName?: string; // <-- new
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  deliveryAddress?: string;
  livreurId?: string;
  createdAt: string; // keep string for ISO date from backend
  updatedAt: string;
}

// One product in the order
export interface OrderFormItem {
  productId: number;
  product: {
    id: number;
    name: string;
    image?: string;
    stock?: number;
    price: number;
  };
  quantity: number;
  unitPrice: number;
  total: number;
}

// Main order form
export interface OrderForm {
  type: "vente" | "achat";        // order type
  clientId: number | null;        // only for "vente"
  supplierId: number | null;      // only for "achat"
  deliveryAddress: string;
  items: OrderFormItem[];
  notes: string;
}


export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  stock: number;
  unitPrice: number;
  total: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contact?: string;
  createdAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  product: Product;
  type: 'in' | 'out' | 'adjustment';
  stock: number;
  reason: string;
  orderId?: string;
  userId: string;
  user: User;
  createdAt: Date;
}


export interface DeliveryStatus {
  id: string;
  orderId: string;
  livreurId: string;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  location?: {
    lat: number;
    lng: number;
  };
  notes?: string;
  updatedAt: Date;
}

export interface DashboardStats {
  // Basic stats
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  
  // Inventory stats
  lowStockProducts: number
  outOfStockProducts: number
  
  // Order stats
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  
  // User stats
  deliveryUsers: number
  newUsersThisMonth: number
  
  // Analytics
  monthlyRevenue: number[]
  weeklyRevenue: number[]
  topProducts: TopProduct[]
  averageOrderValue: number
}

export interface TopProduct {
  product: Product
  sold: number
  revenue: number
}

export interface Alert {
  id: string
  type: 'low_stock' | 'out_of_stock' | 'pending_orders'
  title: string
  message: string
  productId?: string
  read: boolean
  createdAt: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
}