// Fix: Define and export all necessary types for the application.
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  brand: string;
  imageUrl: string;
}

export type LeadStatus = 'New' | 'Verified' | 'Quoted' | 'Converted' | 'Completed';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phoneVerified: boolean;
  interest: string;
  status: LeadStatus;
  score: number;
  createdAt: Date;
}

export interface MaintenancePlan {
  name: string;
  price: number;
}

export enum Page {
  Home,
  Configurator,
  Admin,
  Success,
}

export interface ConfigState {
  step: number;
  selectedCategories: string[];
  components: { [productId: string]: number };
  maintenancePlan: string;
}
