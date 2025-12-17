// src/lib/productCategories.ts
export const productCategories = [
  'Fruits',
  'Vegetables',
  'Grains',
  'Dairy',
  'Meat',
  'Poultry',
  'Seafood',
  'Nuts',
  'Herbs',
  'Spices'
] as const;

export type ProductCategory = typeof productCategories[number];
