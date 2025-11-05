import { Product, Lead, MaintenancePlan } from './types';

export const PRODUCTS: Product[] = [
  // Security Systems
  { id: 'cctv_dome', name: '4MP Security Dome Camera', price: 30, category: 'Security Systems', subcategory: 'Cameras', brand: 'UTECH Security', imageUrl: 'https://placehold.co/600x400/0D9488/white?text=4MP+Dome+Camera' },
  { id: 'nvr_8ch', name: '8-Channel NVR', price: 120, category: 'Security Systems', subcategory: 'Recorders', brand: 'UTECH Security', imageUrl: 'https://placehold.co/600x400/0D9488/white?text=8-Ch+NVR' },
  { id: 'door_lock', name: 'Smart RFID Door Lock', price: 60, category: 'Security Systems', subcategory: 'Access Control', brand: 'UTECH Security', imageUrl: 'https://placehold.co/600x400/0D9488/white?text=RFID+Door+Lock' },
  
  // Laptops
  { id: 'mbp_14', name: 'MacBook Pro 14" (M3)', price: 750, category: 'Laptops', subcategory: 'MacBooks', brand: 'Apple', imageUrl: 'https://placehold.co/600x400/9ca3af/white?text=MacBook+Pro' },
  { id: 'mba_13', name: 'MacBook Air 13" (M2)', price: 450, category: 'Laptops', subcategory: 'MacBooks', brand: 'Apple', imageUrl: 'https://placehold.co/600x400/9ca3af/white?text=MacBook+Air' },
  { id: 'dell_xps15', name: 'Dell XPS 15 Laptop', price: 680, category: 'Laptops', subcategory: 'Windows Laptops', brand: 'Dell', imageUrl: 'https://placehold.co/600x400/9ca3af/white?text=Dell+XPS+15' },
  { id: 'lenovo_thinkpad', name: 'Lenovo ThinkPad X1 Carbon', price: 620, category: 'Laptops', subcategory: 'Windows Laptops', brand: 'Lenovo', imageUrl: 'https://placehold.co/600x400/9ca3af/white?text=ThinkPad+X1' },

  // Computers
  { id: 'imac_24', name: 'iMac 24" (M3)', price: 600, category: 'Computers', subcategory: 'All-in-One PCs', brand: 'Apple', imageUrl: 'https://placehold.co/600x400/9ca3af/white?text=iMac+24"' },
  { id: 'dell_optiplex', name: 'Dell OptiPlex Micro PC', price: 320, category: 'Computers', subcategory: 'Desktops', brand: 'Dell', imageUrl: 'https://placehold.co/600x400/9ca3af/white?text=OptiPlex+PC' },

  // Printers & Office
  { id: 'hp_laserjet', name: 'HP Color LaserJet Pro MFP', price: 220, category: 'Printers & Office', subcategory: 'Laser Printers', brand: 'HP', imageUrl: 'https://placehold.co/600x400/3b82f6/white?text=HP+LaserJet' },
  { id: 'epson_ecotank', name: 'Epson EcoTank ET-4850', price: 180, category: 'Printers & Office', subcategory: 'Inkjet Printers', brand: 'Epson', imageUrl: 'https://placehold.co/600x400/3b82f6/white?text=Epson+EcoTank' },
  
  // Networking
  { id: 'unifi_dream', name: 'Ubiquiti UniFi Dream Machine', price: 150, category: 'Networking', subcategory: 'Routers', brand: 'Ubiquiti', imageUrl: 'https://placehold.co/600x400/1e293b/white?text=UniFi+Router' },
  
  // Accessories
  { id: 'dell_ultrasharp', name: 'Dell UltraSharp 27" Monitor', price: 280, category: 'Accessories', subcategory: 'Monitors', brand: 'Dell', imageUrl: 'https://placehold.co/600x400/1e293b/white?text=27"+Monitor' },
  { id: 'logitech_mx', name: 'Logitech MX Master 3S Mouse', price: 45, category: 'Accessories', subcategory: 'Peripherals', brand: 'Logitech', imageUrl: 'https://placehold.co/600x400/1e293b/white?text=MX+Master+3S' },
];

export const MOCK_LEADS: Lead[] = [
    { id: '12345', name: 'Abdullah Al Balushi', company: 'Muscat Hotel LLC', email: 'abdullah@muscathotel.com', phoneVerified: true, interest: 'Full Package', status: 'New', score: 0, createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: '12346', name: 'Jane Doe', company: 'Salty Seas Motel', email: 'jane@saltyseas.net', phoneVerified: false, interest: 'Access Control', status: 'Quoted', score: 0, createdAt: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: '12347', name: 'Khalid A.', company: 'Khalid Apartments', email: 'khalid@gmail.com', phoneVerified: true, interest: 'CCTV', status: 'Converted', score: 0, createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) },
];

export const MAINTENANCE_PLANS: { [key: string]: MaintenancePlan } = {
    None: { name: 'None', price: 0 },
    Basic: { name: 'Basic', price: 20 },
    Standard: { name: 'Standard', price: 45 },
    Premium: { name: 'Premium', price: 90 },
};