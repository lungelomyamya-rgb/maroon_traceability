// src/lib/validation.ts
import { z } from 'zod';

// Define the product schema
const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  harvestDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Invalid date'
  ),
  location: z.string().min(1, 'Location is required'),
});

// Define the product type based on the schema
export type ProductFormData = z.infer<typeof productSchema>;

// Define explicit return types
type ValidationSuccess = {
  success: true;
  data: ProductFormData;
};

type ValidationError = {
  success: false;
  errors: Record<string, string>;
};

export type ValidationResult = ValidationSuccess | ValidationError;

// Update the validation function to use the correct return type
export function validateProduct(data: ProductFormData): ValidationResult {
  const result = productSchema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { success: false, errors } as const;
  }
  
  return { success: true, data: result.data } as const;
}