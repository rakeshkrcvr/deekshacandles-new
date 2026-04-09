
export type ProductTemplate = 'apparel' | 'accessories' | 'footwear' | 'candles' | 'general';

export interface TemplateField {
  name: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'number' | 'select' | 'textarea';
  options?: string[];
}

export const PRODUCT_TEMPLATES: Record<ProductTemplate, { label: string; fields: TemplateField[] }> = {
  apparel: {
    label: 'Fashion & Apparel (Jeans, T-Shirts)',
    fields: [
      { name: 'availableSizes', label: 'Available Sizes', placeholder: 'e.g., S, M, L, XL OR 28, 30, 32, 34' },
      { name: 'fabric', label: 'Fabric/Material', placeholder: 'e.g., 100% Cotton, Denim' },
      { name: 'fit', label: 'Fit', placeholder: 'e.g., Slim Fit, Oversized' },
      { name: 'pattern', label: 'Pattern', placeholder: 'e.g., Solid, Printed, Striped' },
      { name: 'washCare', label: 'Wash Care', placeholder: 'e.g., Machine wash cold' },
      { name: 'sizeChart', label: 'Size Chart Info', placeholder: 'e.g., Slim fit, true to size' },
      { name: 'colors', label: 'Color Hex Codes', placeholder: 'e.g., #000000, #FFFFFF, #FF0000' },
      { name: 'dispatchTime', label: 'Dispatch Time', placeholder: 'e.g., Dispatched in 24-48 hours' },
      { name: 'returnPolicy', label: 'Return Policy Note', placeholder: 'e.g., 7 Days easy return & exchange' },
    ]
  },
  accessories: {
    label: 'Accessories (Wallets, Belts, Jewellery)',
    fields: [
      { name: 'material', label: 'Material Details', placeholder: 'e.g., Vegan Leather, Stainless Steel' },
      { name: 'dimensions', label: 'Dimensions', placeholder: 'e.g., 10cm x 12cm' },
      { name: 'compartments', label: 'Compartments', placeholder: 'e.g., 5 Card slots, 2 Cash pockets' },
      { name: 'plating', label: 'Plating/Finish', placeholder: 'e.g., 18K Gold Plated, Matte Finish' },
      { name: 'closure', label: 'Closure Type', placeholder: 'e.g., Magnetic snap, Buckle' },
      { name: 'colors', label: 'Color Hex Codes', placeholder: 'e.g., #000000, #FFFFFF, #FF0000' },
      { name: 'dispatchTime', label: 'Dispatch Time', placeholder: 'e.g., Dispatched in 24-48 hours' },
      { name: 'returnPolicy', label: 'Return Policy Note', placeholder: 'e.g., No Returns (Health & Hygiene)' },
    ]
  },
  footwear: {
    label: 'Footwear (Shoes)',
    fields: [
      { name: 'availableSizes', label: 'Available Sizes', placeholder: 'e.g., 6, 7, 8, 9, 10' },
      { name: 'outerMaterial', label: 'Outer Material', placeholder: 'e.g., Mesh, Synthetic Leather' },
      { name: 'soleMaterial', label: 'Sole Material', placeholder: 'e.g., Rubber, EVA, TPR' },
      { name: 'fastening', label: 'Fastening', placeholder: 'e.g., Lace-up, Slip-on' },
      { name: 'occasion', label: 'Occasion', placeholder: 'e.g., Sports, Casual, Formal' },
      { name: 'dispatchTime', label: 'Dispatch Time', placeholder: 'e.g., Dispatched in 24-48 hours' },
      { name: 'returnPolicy', label: 'Return Policy Note', placeholder: 'e.g., 7 Days easy size exchange' },
    ]
  },
  candles: {
    label: 'Gifts & Scented Candles',
    fields: [
      { name: 'fragrance', label: 'Fragrance Profile', placeholder: 'Top, Middle, and Base notes' },
      { name: 'burnTime', label: 'Burn Time', placeholder: 'e.g., 60 Hours' },
      { name: 'waxType', label: 'Wax Type', placeholder: 'e.g., Soy wax, Beeswax' },
      { name: 'weight', label: 'Weight/Volume', placeholder: 'e.g., 200g / 300ml' },
      { name: 'dimensions', label: 'Jar Dimensions', placeholder: 'e.g., 3x4 inches' },
      { name: 'dispatchTime', label: 'Dispatch Time', placeholder: 'e.g., Dispatched in 24-48 hours' },
      { name: 'returnPolicy', label: 'Return Policy Note', placeholder: 'e.g., No Returns (Fragile nature)' },
    ]
  },
  general: {
    label: 'General Product',
    fields: [
      { name: 'material', label: 'Material', placeholder: 'e.g., Wood, Plastic, Metal' },
      { name: 'origin', label: 'Origin', placeholder: 'e.g., Made in India' },
    ]
  }
};
