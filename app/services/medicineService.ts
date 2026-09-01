import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Gel' | 'Drops';
  price: number;
  discountPrice?: number;
  requiresPrescription: boolean;
  packSize: string;
  manufacturer: string;
  inStock: boolean;
}

export interface CartItem {
  medicine: MedicineItem;
  quantity: number;
  autoRefill: boolean;
}

export type OrderTrackingStep = 'placed' | 'verified' | 'packed' | 'out_for_delivery' | 'delivered';

export interface MedicineOrder {
  id: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  mobile: string;
  pincode: string;
  patientName: string;
  orderDate: string;
  status: 'active' | 'completed' | 'cancelled';
  trackingStep: OrderTrackingStep;
  estimatedDelivery: string;
  prescriptionUri?: string;
}

const MEDICINE_ORDERS_KEY = 'cureai_medicine_orders';

export const MEDICINE_CATALOG: MedicineItem[] = [
  {
    id: 'med_1',
    name: 'Telmisartan 40mg (Telma 40)',
    genericName: 'Telmisartan',
    dosage: '40mg',
    form: 'Tablet',
    price: 180,
    discountPrice: 155,
    requiresPrescription: true,
    packSize: 'Strip of 15 tablets',
    manufacturer: 'Glenmark Pharmaceuticals',
    inStock: true,
  },
  {
    id: 'med_2',
    name: 'Metformin 500mg (Glycomet 500)',
    genericName: 'Metformin Hydrochloride',
    dosage: '500mg',
    form: 'Tablet',
    price: 65,
    discountPrice: 52,
    requiresPrescription: true,
    packSize: 'Strip of 20 tablets',
    manufacturer: 'USV Ltd',
    inStock: true,
  },
  {
    id: 'med_3',
    name: 'Atorvastatin 10mg (Atorva 10)',
    genericName: 'Atorvastatin',
    dosage: '10mg',
    form: 'Tablet',
    price: 140,
    discountPrice: 118,
    requiresPrescription: true,
    packSize: 'Strip of 15 tablets',
    manufacturer: 'Zydus Cadila',
    inStock: true,
  },
  {
    id: 'med_4',
    name: 'Dolo 650 Tablet',
    genericName: 'Paracetamol',
    dosage: '650mg',
    form: 'Tablet',
    price: 35,
    discountPrice: 30,
    requiresPrescription: false,
    packSize: 'Strip of 15 tablets',
    manufacturer: 'Micro Labs Ltd',
    inStock: true,
  },
  {
    id: 'med_5',
    name: 'Digene Gel Acidity Relief',
    genericName: 'Magnesium Hydroxide + Aluminium Hydroxide',
    dosage: '200ml',
    form: 'Syrup',
    price: 160,
    discountPrice: 140,
    requiresPrescription: false,
    packSize: 'Bottle of 200 ml',
    manufacturer: 'Abbott Healthcare',
    inStock: true,
  },
  {
    id: 'med_6',
    name: 'Volini Pain Relief Gel',
    genericName: 'Diclofenac Diethylamine',
    dosage: '50g',
    form: 'Gel',
    price: 185,
    discountPrice: 162,
    requiresPrescription: false,
    packSize: 'Tube of 50g',
    manufacturer: 'Sun Pharma',
    inStock: true,
  },
  {
    id: 'med_7',
    name: 'Becosules Z Capsules',
    genericName: 'Vitamin B-Complex with Zinc',
    dosage: 'Daily',
    form: 'Capsule',
    price: 55,
    discountPrice: 48,
    requiresPrescription: false,
    packSize: 'Strip of 20 capsules',
    manufacturer: 'Pfizer',
    inStock: true,
  },
  {
    id: 'med_8',
    name: 'ORS Sachet (Electral)',
    genericName: 'Oral Rehydration Salts IP',
    dosage: '21.8g',
    form: 'Tablet',
    price: 24,
    discountPrice: 20,
    requiresPrescription: false,
    packSize: 'Sachet of 21.8g',
    manufacturer: 'FDC Ltd',
    inStock: true,
  }
];

const INITIAL_ORDERS: MedicineOrder[] = [
  {
    id: 'ORD-98241',
    items: [
      { medicine: MEDICINE_CATALOG[0], quantity: 2, autoRefill: true },
      { medicine: MEDICINE_CATALOG[1], quantity: 1, autoRefill: true },
      { medicine: MEDICINE_CATALOG[3], quantity: 1, autoRefill: false }
    ],
    totalAmount: 392,
    deliveryAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru',
    mobile: '9876543210',
    pincode: '560103',
    patientName: 'Ramesh Sharma',
    orderDate: '2026-08-20',
    status: 'active',
    trackingStep: 'out_for_delivery',
    estimatedDelivery: 'Today, by 4:00 PM',
  }
];

export const medicineService = {
  getAvailableMedicines(): MedicineItem[] {
    return MEDICINE_CATALOG;
  },

  async getOrders(): Promise<MedicineOrder[]> {
    try {
      const raw = await AsyncStorage.getItem(MEDICINE_ORDERS_KEY);
      if (!raw) {
        await AsyncStorage.setItem(MEDICINE_ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  async detectMedicinesFromPrescription(imageUri: string): Promise<{
    detectedMedicines: MedicineItem[];
    doctorName?: string;
    confidence: number;
  }> {
    // Simulate OCR delay
    await new Promise(res => setTimeout(res, 1800));

    return {
      detectedMedicines: [MEDICINE_CATALOG[0], MEDICINE_CATALOG[1], MEDICINE_CATALOG[6]],
      doctorName: 'Dr. Aisha Verma (Cardiologist)',
      confidence: 0.94,
    };
  },

  async createOrder(orderParams: Omit<MedicineOrder, 'id' | 'orderDate' | 'status' | 'trackingStep' | 'estimatedDelivery'>): Promise<MedicineOrder> {
    const orders = await this.getOrders();
    const newOrder: MedicineOrder = {
      ...orderParams,
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'active',
      trackingStep: 'placed',
      estimatedDelivery: 'Tomorrow, by 2:00 PM',
    };

    const updated = [newOrder, ...orders];
    await AsyncStorage.setItem(MEDICINE_ORDERS_KEY, JSON.stringify(updated));
    return newOrder;
  },

  async cancelOrder(orderId: string): Promise<MedicineOrder[]> {
    const orders = await this.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' as const } : o);
    await AsyncStorage.setItem(MEDICINE_ORDERS_KEY, JSON.stringify(updated));
    return updated;
  }
};
