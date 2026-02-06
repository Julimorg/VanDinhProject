import { z } from 'zod';

export const productCsvRowSchema = z.object({
  // Điều chỉnh theo template thực tế của bạn
  sku: z.string().min(3).max(50),
  name: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Giá phải là số hợp lệ'),
  stock: z.string().regex(/^\d+$/, 'Tồn kho phải là số nguyên'),
  category: z.string().min(1),
  supplier: z.string().min(1).optional(),
  status: z.enum(['active', 'inactive', 'draft']).default('active'),
  weight: z.string().regex(/^\d+(\.\d+)?$/, 'Cân nặng không hợp lệ').optional(),
  // thêm các trường khác nếu cần
});

export const productCsvFileSchema = z.array(productCsvRowSchema);

export type ProductCsvRow = z.infer<typeof productCsvRowSchema>;