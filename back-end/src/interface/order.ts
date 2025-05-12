export interface IOrder {
  _id?: string;
  order_details: {
    address: string;
    phone: string;
  };
  userId: string;
  products: {
    _id: string;
    title: string;
    price: number;
    quantity: number;
    adminId?: string;
  }[];
  adminsId: string[];   // ✅ أضف هذا السطر
  total: number;
}
