export interface BrandLogo {
  id: number;
  name: string;
  imagePath: string;
}

// All brand logos (PNG with no background)
const allBrandLogos: BrandLogo[] = [
  { id: 1, name: 'Brand 1', imagePath: '/logos/image (1).png' },
  { id: 2, name: 'Brand 2', imagePath: '/logos/image (2).png' },
  { id: 3, name: 'Brand 3', imagePath: '/logos/insiderLogoWhite.png' },
  { id: 4, name: 'Brand 4', imagePath: '/logos/logo-1.png' },
  { id: 5, name: 'Brand 5', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.45.04-removebg-preview.png' },
  { id: 6, name: 'Brand 6', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.45.28-removebg-preview.png' },
  { id: 7, name: 'Brand 7', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.45.47-removebg-preview.png' },
  { id: 8, name: 'Brand 8', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.47.17-removebg-preview.png' },
  { id: 9, name: 'Brand 9', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.47.33-removebg-preview.png' },
  { id: 10, name: 'Brand 10', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.47.59-removebg-preview.png' },
  { id: 11, name: 'Brand 11', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.48.23-removebg-preview.png' },
  { id: 12, name: 'Brand 12', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.49.50-removebg-preview.png' },
  { id: 13, name: 'Brand 13', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.57.13-removebg-preview.png' },
  { id: 14, name: 'Brand 14', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.57.42-removebg-preview.png' },
  { id: 15, name: 'Brand 15', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.58.17-removebg-preview.png' },
  { id: 16, name: 'Brand 16', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.58.35-removebg-preview.png' },
  { id: 17, name: 'Brand 17', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_03.59.56-removebg-preview.png' },
  { id: 18, name: 'Brand 18', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_04.00.22-removebg-preview.png' },
  { id: 19, name: 'Brand 19', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_04.01.26-removebg-preview.png' },
  { id: 20, name: 'Brand 20', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_04.02.24-removebg-preview.png' },
  { id: 21, name: 'Brand 21', imagePath: '/logos/WhatsApp_Image_2025-11-09_at_04.02.47-removebg-preview.png' },
];

// Split into two rows: 11 logos in first row, 10 logos in second row
export const topRowLogos: BrandLogo[] = allBrandLogos.slice(0, 11);
export const bottomRowLogos: BrandLogo[] = allBrandLogos.slice(11, 21);
