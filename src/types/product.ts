// src/types/product.ts
export type ProductCategory = 
  | 'Fruit' 
  | 'Veg' 
  | 'Beef' 
  | 'Poultry' 
  | 'Pork' 
  | 'Lamb' 
  | 'Goat' 
  | 'Fish';

export interface NewProduct {
  productName: string;
  category: ProductCategory;
  location: string;
  harvestDate: string;
  certifications: string[];
  batchSize: string;
  description: string;
}