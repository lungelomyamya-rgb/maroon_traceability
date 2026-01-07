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

export type productCategory = typeof productCategories[number];
