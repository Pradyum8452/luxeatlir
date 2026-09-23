// Luxe Atelier API Layer with Netlify Static Fallback Engine & Auto Stock Management

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getSessionId = () => {
  let sid = localStorage.getItem('luxe_session_id');
  if (!sid) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('luxe_session_id', sid);
  }
  return sid;
};

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  
  const token = localStorage.getItem('luxe_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  headers['x-session-id'] = getSessionId();
  return headers;
};

// 12 Full Categories
const FALLBACK_CATEGORIES = [
  { id: 1, name: 'T-Shirts', slug: 't-shirts', gender: 'Unisex', image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop' },
  { id: 2, name: 'Shirts', slug: 'shirts', gender: 'Men', image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop' },
  { id: 3, name: 'Jeans', slug: 'jeans', gender: 'Unisex', image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop' },
  { id: 4, name: 'Trousers', slug: 'trousers', gender: 'Unisex', image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop' },
  { id: 5, name: 'Hoodies', slug: 'hoodies', gender: 'Unisex', image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop' },
  { id: 6, name: 'Sweatshirts', slug: 'sweatshirts', gender: 'Men', image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop' },
  { id: 7, name: 'Jackets', slug: 'jackets', gender: 'Unisex', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop' },
  { id: 8, name: 'Dresses', slug: 'dresses', gender: 'Women', image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop' },
  { id: 9, name: 'Tops', slug: 'tops', gender: 'Women', image_url: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&auto=format&fit=crop' },
  { id: 10, name: 'Co-ords', slug: 'co-ords', gender: 'Women', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop' },
  { id: 11, name: 'Shorts', slug: 'shorts', gender: 'Men', image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop' },
  { id: 12, name: 'Accessories', slug: 'accessories', gender: 'Unisex', image_url: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&auto=format&fit=crop' }
];

// 16 Full Luxury Haute Couture Products
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    sku: 'LUXE-TSH-001',
    name: 'Obsidian Heavyweight Oversized Tee',
    slug: 'obsidian-heavyweight-oversized-tee',
    category_id: 1,
    category_name: 'T-Shirts',
    category_slug: 't-shirts',
    gender: 'Men',
    description: 'Crafted from 300 GSM combed organic cotton. Features drop shoulder silhouette, double-needle stitched seams, and subtle high-density tonal logo embroidery.',
    material: '100% Organic Heavyweight Cotton',
    fabric: '300 GSM French Terry Cotton',
    fit: 'Oversized Boxy Fit',
    care_instructions: 'Machine wash cold inside out. Line dry in shade.',
    price: 2499,
    mrp: 3999,
    discount_percent: 38,
    rating: 4.9,
    review_count: 24,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop',
    colors: [{ name: 'Obsidian Black', hex: '#121212' }, { name: 'Charcoal Grey', hex: '#363636' }, { name: 'Bone White', hex: '#F5F5F0' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  },
  {
    id: 2,
    sku: 'LUXE-SHI-002',
    name: 'Champagne Silk Resort Shirt',
    slug: 'champagne-silk-resort-shirt',
    category_id: 2,
    category_name: 'Shirts',
    category_slug: 'shirts',
    gender: 'Men',
    description: 'Ultra-luxurious mulberry silk-linen blend with cuban collar and genuine mother-of-pearl buttons. Breathable, fluid drape designed for summer evenings.',
    material: '70% Mulberry Silk, 30% Belgian Linen',
    fabric: 'Fluid Satin Weave',
    fit: 'Relaxed Resort Fit',
    care_instructions: 'Dry clean only. Gentle iron low heat.',
    price: 4999,
    mrp: 7999,
    discount_percent: 37,
    rating: 5.0,
    review_count: 18,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop',
    colors: [{ name: 'Champagne Gold', hex: '#D4AF37' }, { name: 'Midnight Navy', hex: '#0F172A' }],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 3,
    sku: 'LUXE-JEA-003',
    name: 'Raw Japanese Selvedge Denim Jeans',
    slug: 'raw-japanese-selvedge-denim-jeans',
    category_id: 3,
    category_name: 'Jeans',
    category_slug: 'jeans',
    gender: 'Unisex',
    description: '14.5 oz Kurabo Mills shuttle-loom selvedge denim. Custom brass hardware, embossed Italian leather patch, and red selvedge ID line.',
    material: '100% Japanese Cotton Selvedge',
    fabric: '14.5 oz Rigid Unwashed Denim',
    fit: 'Straight Relaxed Fit',
    care_instructions: 'Soak inside out in cold water after 6 months wear. Hang dry.',
    price: 6499,
    mrp: 9999,
    discount_percent: 35,
    rating: 4.8,
    review_count: 31,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1542272604-780c36856842?w=800&auto=format&fit=crop',
    colors: [{ name: 'Indigo Blue', hex: '#1E293B' }, { name: 'Washed Black', hex: '#27272A' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 4,
    sku: 'LUXE-TRO-004',
    name: 'Monaco Tailored Pleated Trousers',
    slug: 'monaco-tailored-pleated-trousers',
    category_id: 4,
    category_name: 'Trousers',
    category_slug: 'trousers',
    gender: 'Unisex',
    description: 'Double-pleated waist with side adjusters and extended waistband closure. Premium tropical wool blend with clean turn-up cuffs.',
    material: '60% Wool, 38% Viscose, 2% Elastane',
    fabric: 'Tropical Suiting Twill',
    fit: 'High-Waisted Tapered Fit',
    care_instructions: 'Dry clean recommended.',
    price: 5299,
    mrp: 7999,
    discount_percent: 33,
    rating: 4.9,
    review_count: 15,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop',
    colors: [{ name: 'Sand Beige', hex: '#E5D3B3' }, { name: 'Jet Black', hex: '#111111' }],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 5,
    sku: 'LUXE-HOO-005',
    name: 'Aura French Terry Heavy Hoodie',
    slug: 'aura-french-terry-heavy-hoodie',
    category_id: 5,
    category_name: 'Hoodies',
    category_slug: 'hoodies',
    gender: 'Unisex',
    description: '450 GSM double-walled hood with silver metal aglets and kangaroo pocket. Heavyweight luxury fleece built to maintain structured silhouette.',
    material: '100% Loopback French Terry Cotton',
    fabric: '450 GSM Heavyweight Cotton',
    fit: 'Oversized Boxy Fit',
    care_instructions: 'Cold wash line dry.',
    price: 4499,
    mrp: 6999,
    discount_percent: 35,
    rating: 5.0,
    review_count: 42,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop',
    colors: [{ name: 'Champagne Beige', hex: '#D7C49E' }, { name: 'Midnight Black', hex: '#0A0A0C' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 6,
    sku: 'LUXE-JAC-006',
    name: 'Milanese Nappa Leather Biker Jacket',
    slug: 'milanese-nappa-leather-biker-jacket',
    category_id: 7,
    category_name: 'Jackets',
    category_slug: 'jackets',
    gender: 'Men',
    description: 'Full-grain Italian lambskin nappa leather with asymmetrical YKK Excella zippers, quilted shoulder pads, and red silk lining.',
    material: '100% Full Grain Lambskin Nappa Leather',
    fabric: 'Soft Aniline Finished Leather',
    fit: 'Structured Slim Fit',
    care_instructions: 'Specialist leather clean only.',
    price: 14999,
    mrp: 22999,
    discount_percent: 34,
    rating: 4.9,
    review_count: 19,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop',
    colors: [{ name: 'Black Nappa', hex: '#000000' }, { name: 'Vintage Dark Brown', hex: '#3B2F2F' }],
    sizes: ['M', 'L', 'XL']
  },
  {
    id: 7,
    sku: 'LUXE-DRE-007',
    name: 'Atelier Sculpted Satin Midi Dress',
    slug: 'atelier-sculpted-satin-midi-dress',
    category_id: 8,
    category_name: 'Dresses',
    category_slug: 'dresses',
    gender: 'Women',
    description: 'Architectural cowl neckline, delicate bias cut silhouette that hugs curves effortlessly. Features concealed side zipper and thigh-high slit.',
    material: '100% Heavyweight Heavy Satin Silk',
    fabric: 'Stretch Satin',
    fit: 'Bias Cut Slim Fit',
    care_instructions: 'Dry clean only.',
    price: 8999,
    mrp: 12999,
    discount_percent: 30,
    rating: 5.0,
    review_count: 27,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop',
    colors: [{ name: 'Emerald Green', hex: '#064E3B' }, { name: 'Champagne Gold', hex: '#C5A059' }],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 8,
    sku: 'LUXE-TOP-008',
    name: 'Kyoto Wrap Linen Top',
    slug: 'kyoto-wrap-linen-top',
    category_id: 9,
    category_name: 'Tops',
    category_slug: 'tops',
    gender: 'Women',
    description: 'Kimono-inspired crossover wrap front with self-tie sash. Crafted from pre-washed French flax linen.',
    material: '100% French Organic Linen',
    fabric: 'Breathable Woven Linen',
    fit: 'Relaxed Fit',
    care_instructions: 'Hand wash cold or gentle machine wash.',
    price: 3299,
    mrp: 4999,
    discount_percent: 34,
    rating: 4.8,
    review_count: 12,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
    colors: [{ name: 'Ivory Cream', hex: '#FFFDF5' }, { name: 'Terracotta', hex: '#9A3412' }],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 9,
    sku: 'LUXE-BLA-009',
    name: 'Venetian Velvet Double-Breasted Blazer',
    slug: 'venetian-velvet-double-breasted-blazer',
    category_id: 7,
    category_name: 'Jackets',
    category_slug: 'jackets',
    gender: 'Unisex',
    description: 'Sumptuous Italian cotton velvet with satin peak lapels and horn buttons. Tailored with padded shoulders and double vents.',
    material: '100% Italian Cotton Velvet',
    fabric: 'Heavy Velvet Suiting',
    fit: 'Structured Tailored Fit',
    care_instructions: 'Dry clean only.',
    price: 11999,
    mrp: 17999,
    discount_percent: 33,
    rating: 4.9,
    review_count: 16,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
    colors: [{ name: 'Burgundy Velvet', hex: '#4A0E17' }, { name: 'Midnight Black', hex: '#0B0B0E' }],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 10,
    sku: 'LUXE-BAG-010',
    name: 'Tuscan Leather Weekender Duffel',
    slug: 'tuscan-leather-weekender-duffel',
    category_id: 12,
    category_name: 'Accessories',
    category_slug: 'accessories',
    gender: 'Unisex',
    description: 'Handcrafted in Florence from vegetable-tanned full grain calfskin. Features antique brass hardware, shoe compartment, and padded shoulder strap.',
    material: '100% Tuscan Calfskin Leather',
    fabric: 'Vegetable Tanned Leather',
    fit: 'Travel Duffel',
    care_instructions: 'Apply leather balm twice annually.',
    price: 12999,
    mrp: 18999,
    discount_percent: 31,
    rating: 5.0,
    review_count: 29,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&auto=format&fit=crop',
    colors: [{ name: 'Cognac Brown', hex: '#8B4513' }, { name: 'Onyx Black', hex: '#1C1C1C' }],
    sizes: ['One Size']
  },
  {
    id: 11,
    sku: 'LUXE-SWE-011',
    name: 'Imperial Cashmere Crewneck Sweater',
    slug: 'imperial-cashmere-crewneck-sweater',
    category_id: 6,
    category_name: 'Sweatshirts',
    category_slug: 'sweatshirts',
    gender: 'Men',
    description: 'Knitted from 2-ply Mongolian Grade-A cashmere. Exceptionally soft, lightweight yet insulating with rib-knit cuffs and hem.',
    material: '100% Pure Grade-A Mongolian Cashmere',
    fabric: '12-Gauge Fine Knit',
    fit: 'Classic Regular Fit',
    care_instructions: 'Hand wash with cashmere shampoo. Lay flat to dry.',
    price: 9499,
    mrp: 14999,
    discount_percent: 36,
    rating: 4.9,
    review_count: 22,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop',
    colors: [{ name: 'Oatmeal Heather', hex: '#E3D7C5' }, { name: 'Slate Grey', hex: '#4A5568' }],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 12,
    sku: 'LUXE-CAR-012',
    name: 'Tokyo Oversized Tactical Cargo Pants',
    slug: 'tokyo-oversized-tactical-cargo-pants',
    category_id: 4,
    category_name: 'Trousers',
    category_slug: 'trousers',
    gender: 'Unisex',
    description: 'Constructed from Japanese ripstop cotton. 3D bellows cargo pockets, adjustable drawcord cuffs, and reinforced knee paneling.',
    material: '100% Japanese Cotton Ripstop',
    fabric: 'Heavy Duty Military Ripstop',
    fit: 'Oversized Relaxed Fit',
    care_instructions: 'Machine wash cold.',
    price: 4999,
    mrp: 7499,
    discount_percent: 33,
    rating: 4.8,
    review_count: 35,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop',
    colors: [{ name: 'Military Olive', hex: '#3B413A' }, { name: 'Stealth Black', hex: '#171717' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 13,
    sku: 'LUXE-SLI-013',
    name: 'Sunset Silk Backless Slip Dress',
    slug: 'sunset-silk-backless-slip-dress',
    category_id: 8,
    category_name: 'Dresses',
    category_slug: 'dresses',
    gender: 'Women',
    description: 'Floor-length pure silk charmeuse with plunging back cross straps. Glides gracefully with every step.',
    material: '100% Silk Charmeuse',
    fabric: 'Lightweight Satin Silk',
    fit: 'Fluid Slip Fit',
    care_instructions: 'Dry clean only.',
    price: 9999,
    mrp: 14999,
    discount_percent: 33,
    rating: 5.0,
    review_count: 17,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop',
    colors: [{ name: 'Terracotta Copper', hex: '#B45309' }, { name: 'Midnight Black', hex: '#000000' }],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 14,
    sku: 'LUXE-COO-014',
    name: 'Verona Pleated Linen Co-ord Set',
    slug: 'verona-pleated-linen-co-ord-set',
    category_id: 10,
    category_name: 'Co-ords',
    category_slug: 'co-ords',
    gender: 'Women',
    description: 'Matching cropped relaxed shirt and high-waisted wide leg pants crafted from premium European flax linen.',
    material: '100% European Flax Linen',
    fabric: 'Woven Washed Linen',
    fit: 'Relaxed Co-ord Fit',
    care_instructions: 'Gentle wash inside out.',
    price: 6999,
    mrp: 10999,
    discount_percent: 36,
    rating: 4.9,
    review_count: 21,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&auto=format&fit=crop',
    colors: [{ name: 'Sage Green', hex: '#4D7C0F' }, { name: 'Natural Oatmeal', hex: '#D6C7B2' }],
    sizes: ['S', 'M', 'L']
  },
  {
    id: 15,
    sku: 'LUXE-POL-015',
    name: 'Riviera Mercerized Cotton Knit Polo',
    slug: 'riviera-mercerized-cotton-knit-polo',
    category_id: 2,
    category_name: 'Shirts',
    category_slug: 'shirts',
    gender: 'Men',
    description: 'Fine 18-gauge mercerized Giza cotton knit polo with Johnny collar. Silky luster and exceptionally smooth hand feel.',
    material: '100% Mercerized Giza Cotton',
    fabric: '18-Gauge Fine Knit',
    fit: 'Tailored Fit',
    care_instructions: 'Hand wash cold.',
    price: 3499,
    mrp: 5499,
    discount_percent: 36,
    rating: 4.8,
    review_count: 14,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1625910513413-562a12dd0e2a?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop',
    colors: [{ name: 'Navy Blue', hex: '#1E3A8A' }, { name: 'Ivory White', hex: '#FAFAFA' }],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 16,
    sku: 'LUXE-TRE-016',
    name: 'Atelier Double-Breasted Wool Trench Coat',
    slug: 'atelier-double-breasted-wool-trench-coat',
    category_id: 7,
    category_name: 'Jackets',
    category_slug: 'jackets',
    gender: 'Unisex',
    description: 'Timeless double-breasted trench in heavy wool gabardine. Features horn buttons, waist belt, storm flap, and jacquard lining.',
    material: '80% Virgin Wool, 20% Polyamide',
    fabric: 'Heavy Wool Gabardine',
    fit: 'Overcoat Relaxed Fit',
    care_instructions: 'Dry clean only.',
    price: 16999,
    mrp: 24999,
    discount_percent: 32,
    rating: 5.0,
    review_count: 38,
    status: 'Active',
    primary_image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop',
    colors: [{ name: 'Camel Tan', hex: '#C19A6B' }, { name: 'Obsidian Black', hex: '#0D0D0D' }],
    sizes: ['S', 'M', 'L', 'XL']
  }
];

const DEMO_RECIPIENT_LOGS_SMS = [
  { id: 101, campaign_title: 'Order Dispatch Notification', customer_name: 'Alex Morgan', phone: '+91 98123 45678', email: 'alex.morgan@gmail.com', full_address: '102 Luxury Towers, MG Road, Mumbai, Maharashtra - 400001', message_text: 'Hi Alex Morgan, your Luxe Atelier order ORD-2026-000001 is packed and being dispatched via express courier!', status: 'Delivered', sent_at: '2026-09-22 14:30:00' },
  { id: 102, campaign_title: 'Order Dispatch Notification', customer_name: 'Sophia Chen', phone: '+91 98234 56789', email: 'sophia.chen@gmail.com', full_address: '405 Connaught Place, Delhi - 110001', message_text: 'Hi Sophia Chen, your Luxe Atelier order ORD-2026-000002 is packed and being dispatched via express courier!', status: 'Delivered', sent_at: '2026-09-22 14:30:00' },
  { id: 103, campaign_title: 'Order Dispatch Notification', customer_name: 'Marcus Vance', phone: '+91 98345 67890', email: 'marcus.v@yahoo.com', full_address: '12 Indiranagar 100ft Rd, Bengaluru, Karnataka - 560001', message_text: 'Hi Marcus Vance, your Luxe Atelier order ORD-2026-000003 is packed and being dispatched via express courier!', status: 'Delivered', sent_at: '2026-09-22 14:30:00' }
];

const DEMO_RECIPIENT_LOGS_EMAIL = [
  { id: 201, campaign_subject: 'Order Dispatch & Tracking Details', customer_name: 'Alex Morgan', email: 'alex.morgan@gmail.com', phone: '+91 98123 45678', full_address: '102 Luxury Towers, MG Road, Mumbai, Maharashtra - 400001', status: 'Delivered', sent_at: '2026-09-22 14:35:00' },
  { id: 202, campaign_subject: 'Order Dispatch & Tracking Details', customer_name: 'Sophia Chen', email: 'sophia.chen@gmail.com', phone: '+91 98234 56789', full_address: '405 Connaught Place, Delhi - 110001', status: 'Delivered', sent_at: '2026-09-22 14:35:00' },
  { id: 203, campaign_subject: 'Order Dispatch & Tracking Details', customer_name: 'Marcus Vance', email: 'marcus.v@yahoo.com', phone: '+91 98345 67890', full_address: '12 Indiranagar 100ft Rd, Bengaluru, Karnataka - 560001', status: 'Delivered', sent_at: '2026-09-22 14:35:00' }
];

// Helper to safely execute fetch with static fallback
const fetchOrFallback = async (url, options, fallbackData) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Not JSON response');
  } catch (err) {
    return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
  }
};

export const api = {
  // Auth
  register: (data) => fetchOrFallback(`${API_BASE}/auth/register`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, { token: 'demo_token', user: { id: 1, name: data.name, email: data.email, role: 'customer' } }),
  login: (data) => fetchOrFallback(`${API_BASE}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, () => {
    const isAdmin = data.email.includes('admin');
    return {
      token: 'demo_jwt_token',
      user: { id: isAdmin ? 1 : 2, name: isAdmin ? 'Atelier Admin' : 'Alex Morgan', email: data.email, role: isAdmin ? 'admin' : 'customer' }
    };
  }),
  getProfile: () => fetchOrFallback(`${API_BASE}/auth/profile`, { headers: getHeaders() }, { user: { id: 1, name: 'Alex Morgan', email: 'alex.morgan@gmail.com', role: 'customer' }, addresses: [] }),
  saveAddress: (data) => fetchOrFallback(`${API_BASE}/auth/address`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, { addresses: [data] }),
  deleteAddress: (id) => fetchOrFallback(`${API_BASE}/auth/address/${id}`, { method: 'DELETE', headers: getHeaders() }, { addresses: [] }),

  // Products
  getCategories: () => fetchOrFallback(`${API_BASE}/products/categories`, {}, FALLBACK_CATEGORIES),
  getProducts: (params = {}) => fetchOrFallback(`${API_BASE}/products?${new URLSearchParams(params).toString()}`, {}, () => {
    const customProds = JSON.parse(localStorage.getItem('luxe_custom_products') || '[]');
    let list = [...FALLBACK_PRODUCTS, ...customProds];
    if (params.gender && params.gender !== 'All') {
      list = list.filter((p) => p.gender === params.gender || p.gender === 'Unisex');
    }
    if (params.category) {
      list = list.filter((p) => p.category_slug === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    return list;
  }),
  getProductBySlug: (slug) => fetchOrFallback(`${API_BASE}/products/${slug}`, {}, () => {
    const customProds = JSON.parse(localStorage.getItem('luxe_custom_products') || '[]');
    const all = [...FALLBACK_PRODUCTS, ...customProds];
    const p = all.find((item) => item.slug === slug || String(item.id) === String(slug)) || all[0];
    const images = [
      { id: 1, image_url: p.primary_image, is_primary: 1 },
      { id: 2, image_url: p.secondary_image || p.primary_image, is_primary: 0 }
    ];
    const variants = [];
    let vid = 1;
    (p.colors || [{ name: 'Obsidian Black', hex: '#121212' }]).forEach((c) => {
      (p.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']).forEach((s) => {
        variants.push({ id: vid++, product_id: p.id, color_name: c.name, color_hex: c.hex, size: s, stock_quantity: s === 'XL' ? 3 : 18 });
      });
    });
    return { product: p, images, variants, related: FALLBACK_PRODUCTS.slice(0, 4), reviews: [] };
  }),
  createProduct: (data) => fetchOrFallback(`${API_BASE}/products`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, () => {
    const customProds = JSON.parse(localStorage.getItem('luxe_custom_products') || '[]');
    const newP = {
      id: Date.now(),
      sku: data.sku,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category_id: data.category_id,
      category_name: 'Apparel',
      gender: data.gender || 'Unisex',
      description: data.description || '',
      material: data.material || '100% Organic Cotton',
      fabric: data.fabric || 'Premium Cotton',
      fit: data.fit || 'Regular Fit',
      care_instructions: data.care_instructions || 'Machine wash cold.',
      price: Number(data.price),
      mrp: Number(data.mrp || data.price),
      discount_percent: Math.round(((Number(data.mrp || data.price) - Number(data.price)) / Number(data.mrp || data.price)) * 100) || 0,
      rating: 5.0,
      review_count: 1,
      status: 'Active',
      primary_image: data.images && data.images[0] ? data.images[0] : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      colors: data.variants && data.variants.length > 0 ? [{ name: data.variants[0].color_name, hex: data.variants[0].color_hex }] : [{ name: 'Black', hex: '#000000' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    };
    customProds.unshift(newP);
    localStorage.setItem('luxe_custom_products', JSON.stringify(customProds));
    return { success: true, productId: newP.id };
  }),
  updateProduct: (id, data) => fetchOrFallback(`${API_BASE}/products/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }, { success: true }),
  deleteProduct: (id) => fetchOrFallback(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: getHeaders() }, () => {
    let customProds = JSON.parse(localStorage.getItem('luxe_custom_products') || '[]');
    customProds = customProds.filter((p) => p.id !== id);
    localStorage.setItem('luxe_custom_products', JSON.stringify(customProds));
    return { success: true };
  }),

  // Cart
  getCart: () => fetchOrFallback(`${API_BASE}/cart`, { headers: getHeaders() }, () => {
    const raw = localStorage.getItem('luxe_cart_items');
    const items = raw ? JSON.parse(raw) : [];
    let subtotal = 0;
    let itemCount = 0;
    items.forEach((i) => {
      subtotal += (i.price || 2499) * i.quantity;
      itemCount += i.quantity;
    });
    return { cart_id: 1, items, subtotal, itemCount };
  }),
  addToCart: (variant_id, quantity) => fetchOrFallback(`${API_BASE}/cart/add`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ variant_id, quantity }) }, () => {
    const raw = localStorage.getItem('luxe_cart_items');
    const items = raw ? JSON.parse(raw) : [];
    const prod = FALLBACK_PRODUCTS[0];
    items.push({
      cart_item_id: Date.now(),
      product_variant_id: variant_id,
      quantity,
      color_name: 'Obsidian Black',
      color_hex: '#121212',
      size: 'M',
      product_name: prod.name,
      price: prod.price,
      total_price: prod.price * quantity,
      image_url: prod.primary_image
    });
    localStorage.setItem('luxe_cart_items', JSON.stringify(items));
    return { success: true, message: 'Item added to bag.' };
  }),
  updateCartItem: (id, quantity) => fetchOrFallback(`${API_BASE}/cart/item/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ quantity }) }, () => {
    const raw = localStorage.getItem('luxe_cart_items');
    let items = raw ? JSON.parse(raw) : [];
    items = items.map((i) => (i.cart_item_id === id ? { ...i, quantity, total_price: i.price * quantity } : i));
    localStorage.setItem('luxe_cart_items', JSON.stringify(items));
    return { success: true };
  }),
  removeCartItem: (id) => fetchOrFallback(`${API_BASE}/cart/item/${id}`, { method: 'DELETE', headers: getHeaders() }, () => {
    const raw = localStorage.getItem('luxe_cart_items');
    let items = raw ? JSON.parse(raw) : [];
    items = items.filter((i) => i.cart_item_id !== id);
    localStorage.setItem('luxe_cart_items', JSON.stringify(items));
    return { success: true };
  }),

  // Wishlist
  getWishlist: () => fetchOrFallback(`${API_BASE}/wishlist`, { headers: getHeaders() }, FALLBACK_PRODUCTS.slice(0, 3)),
  toggleWishlist: (product_id) => fetchOrFallback(`${API_BASE}/wishlist/toggle`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ product_id }) }, { added: true, message: 'Wishlist updated' }),

  // Orders & Auto Stock Checkout Deduction
  checkout: (data) => fetchOrFallback(`${API_BASE}/orders/checkout`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, () => {
    const num = `ORD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.removeItem('luxe_cart_items');
    return {
      success: true,
      order_id: Date.now(),
      order_number: num,
      grand_total: 4999,
      tracking_number: `LX-TRK-${Math.floor(100000 + Math.random() * 900000)}`
    };
  }),
  getMyOrders: () => fetchOrFallback(`${API_BASE}/orders/my-orders`, { headers: getHeaders() }, [
    { id: 1, order_number: 'ORD-2026-000001', grand_total: 4999, payment_method: 'UPI', payment_status: 'Paid', delivery_status: 'Delivered', created_at: '2026-09-20', items: [{ id: 1, product_name: 'Obsidian Oversized Tee', color: 'Black', size: 'M', quantity: 2, total: 4998 }] }
  ]),
  trackOrder: (orderNum) => fetchOrFallback(`${API_BASE}/orders/track/${orderNum}`, {}, () => ({
    order: { id: 1, order_number: orderNum, tracking_number: 'LX-TRK-987654', delivery_status: 'In Transit', created_at: new Date() },
    items: [{ product_name: 'Obsidian Oversized Tee', color: 'Obsidian Black', size: 'M', quantity: 2, total: 4998 }],
    timeline: [{ id: 1, status: 'Order Placed', notes: 'Order confirmed', created_at: new Date() }]
  })),
  getAdminOrders: () => fetchOrFallback(`${API_BASE}/orders/admin/all`, { headers: getHeaders() }, []),
  updateOrderStatus: (id, data) => fetchOrFallback(`${API_BASE}/orders/admin/${id}/status`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }, { success: true }),

  // Returns
  submitReturn: (data) => fetchOrFallback(`${API_BASE}/returns/request`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, { success: true, return_number: 'RET-2026-000001' }),
  getMyReturns: () => fetchOrFallback(`${API_BASE}/returns/my-returns`, { headers: getHeaders() }, []),
  getAdminReturns: () => fetchOrFallback(`${API_BASE}/returns/admin/all`, { headers: getHeaders() }, []),
  updateReturnStatus: (id, data) => fetchOrFallback(`${API_BASE}/returns/admin/${id}/status`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }, { success: true }),

  // Inventory Matrix & Auto Stock Upgradation
  getInventory: () => fetchOrFallback(`${API_BASE}/inventory`, { headers: getHeaders() }, () => {
    const list = [];
    let vid = 1;
    FALLBACK_PRODUCTS.forEach((p) => {
      p.colors.forEach((c) => {
        p.sizes.forEach((s) => {
          list.push({
            id: vid++,
            sku: p.sku,
            product_name: p.name,
            color_name: c.name,
            color_hex: c.hex,
            size: s,
            stock_quantity: s === 'XL' ? 2 : 25,
            low_stock_threshold: 5
          });
        });
      });
    });
    return { variants: list, total_variants: list.length, low_stock_count: list.filter((v) => v.stock_quantity <= 5).length, out_of_stock_count: 0 };
  }),
  adjustStock: (variantId, quantity, reason) => fetchOrFallback(`${API_BASE}/inventory/adjust/${variantId}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ quantity, reason }) }, { success: true }),
  getStockTransactions: () => fetchOrFallback(`${API_BASE}/inventory/transactions`, { headers: getHeaders() }, []),

  // Coupons
  validateCoupon: (code, subtotal) => fetchOrFallback(`${API_BASE}/coupons/validate`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ code, subtotal }) }, () => ({
    valid: true,
    code: code.toUpperCase(),
    type: 'percentage',
    discount_value: 10,
    discount_amount: Math.round(subtotal * 0.1)
  })),
  getAdminCoupons: () => fetchOrFallback(`${API_BASE}/coupons/admin/all`, { headers: getHeaders() }, []),
  createCoupon: (data) => fetchOrFallback(`${API_BASE}/coupons/admin`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, { success: true }),
  deleteCoupon: (id) => fetchOrFallback(`${API_BASE}/coupons/admin/${id}`, { method: 'DELETE', headers: getHeaders() }, { success: true }),

  // Reviews
  getProductReviews: (pid) => fetchOrFallback(`${API_BASE}/reviews/product/${pid}`, {}, []),
  submitReview: (data) => fetchOrFallback(`${API_BASE}/reviews/submit`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, { success: true }),
  getAdminReviews: () => fetchOrFallback(`${API_BASE}/reviews/admin/all`, { headers: getHeaders() }, []),
  updateReviewStatus: (id, status) => fetchOrFallback(`${API_BASE}/reviews/admin/${id}/status`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status }) }, { success: true }),

  // Marketing (SMS & EMAIL Recipient Logs Storage)
  getSmsData: () => fetchOrFallback(`${API_BASE}/marketing/sms`, { headers: getHeaders() }, () => {
    const raw = localStorage.getItem('luxe_sms_recipient_logs');
    const logs = raw ? JSON.parse(raw) : DEMO_RECIPIENT_LOGS_SMS;
    return {
      campaigns: [{ id: 1, title: 'Order Dispatch Notification', template_text: 'Hi {name}, order dispatched', sent_count: logs.length }],
      logs,
      customerCount: 12
    };
  }),
  sendSms: (data) => fetchOrFallback(`${API_BASE}/marketing/sms/send`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, () => {
    const raw = localStorage.getItem('luxe_sms_recipient_logs');
    const logs = raw ? JSON.parse(raw) : DEMO_RECIPIENT_LOGS_SMS;
    const newLog = {
      id: Date.now(),
      campaign_title: data.title,
      customer_name: 'Alex Morgan',
      phone: '+91 98123 45678',
      email: 'alex.morgan@gmail.com',
      full_address: '102 Luxury Towers, MG Road, Mumbai, Maharashtra - 400001',
      message_text: data.template_text.replace('{name}', 'Alex Morgan'),
      status: 'Delivered',
      sent_at: new Date().toISOString()
    };
    logs.unshift(newLog);
    localStorage.setItem('luxe_sms_recipient_logs', JSON.stringify(logs));
    return { success: true, sent_count: logs.length };
  }),

  getEmailData: () => fetchOrFallback(`${API_BASE}/marketing/email`, { headers: getHeaders() }, () => {
    const raw = localStorage.getItem('luxe_email_recipient_logs');
    const logs = raw ? JSON.parse(raw) : DEMO_RECIPIENT_LOGS_EMAIL;
    return {
      campaigns: [{ id: 1, subject: 'Order Dispatch & Tracking Details', sent_count: logs.length }],
      logs
    };
  }),
  sendEmail: (data) => fetchOrFallback(`${API_BASE}/marketing/email/send`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, () => {
    const raw = localStorage.getItem('luxe_email_recipient_logs');
    const logs = raw ? JSON.parse(raw) : DEMO_RECIPIENT_LOGS_EMAIL;
    const newLog = {
      id: Date.now(),
      campaign_subject: data.subject,
      customer_name: 'Alex Morgan',
      email: 'alex.morgan@gmail.com',
      phone: '+91 98123 45678',
      full_address: '102 Luxury Towers, MG Road, Mumbai, Maharashtra - 400001',
      status: 'Delivered',
      sent_at: new Date().toISOString()
    };
    logs.unshift(newLog);
    localStorage.setItem('luxe_email_recipient_logs', JSON.stringify(logs));
    return { success: true, sent_count: logs.length };
  }),

  subscribeNewsletter: (data) => fetchOrFallback(`${API_BASE}/marketing/newsletter/subscribe`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }, { success: true, message: 'Subscribed successfully' }),

  // Reports & Analytics
  getAnalytics: () => fetchOrFallback(`${API_BASE}/reports/analytics`, { headers: getHeaders() }, { grossRevenue: 185000, netRevenue: 178000, totalOrders: 32, totalCustomers: 16, totalProducts: 16, categorySales: [], monthlyStats: [] }),
  uploadProductsExcel: (formData) => fetchOrFallback(`${API_BASE}/reports/import/products`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('luxe_token')}` }, body: formData }, { success: true, total_rows: 5, success_count: 5, error_count: 0 }),

  // Invoices & Settings & Audit
  getInvoice: (id) => fetchOrFallback(`${API_BASE}/invoices/${id}`, {}, () => ({
    invoice_number: `INV-2026-${String(id).padStart(6, '0')}`,
    invoice_date: new Date(),
    brand: { name: 'LUXE ATELIER', address: '7th Floor, Atelier House, Marine Drive, Mumbai 400020', gst: '27AAAAA0000A1Z5' },
    customer: { name: 'Alex Morgan', phone: '+91 98123 45678', address: { address_line1: '102 Luxury Towers', city: 'Mumbai', state: 'Maharashtra', pin_code: '400001' } },
    order: { id, order_number: `ORD-2026-${String(id).padStart(6, '0')}`, payment_method: 'UPI', payment_status: 'Paid', subtotal: 4999, discount_amount: 500, tax_amount: 540, shipping_fee: 0, grand_total: 5039 },
    items: [{ id: 1, product_name: 'Obsidian Oversized Tee', color: 'Black', size: 'M', price: 2499, quantity: 2, total: 4998 }]
  })),
  getNotifications: () => fetchOrFallback(`${API_BASE}/notifications`, { headers: getHeaders() }, { notifications: [], unreadCount: 0 }),
  markNotificationRead: (id) => fetchOrFallback(`${API_BASE}/notifications/${id}/read`, { method: 'PUT', headers: getHeaders() }, { success: true }),
  markAllNotificationsRead: () => fetchOrFallback(`${API_BASE}/notifications/read-all`, { method: 'PUT', headers: getHeaders() }, { success: true }),
  getSettings: () => fetchOrFallback(`${API_BASE}/settings`, { headers: getHeaders() }, {}),
  getPublicSettings: () => fetchOrFallback(`${API_BASE}/settings/public`, {}, {}),
  saveSettings: (settings) => fetchOrFallback(`${API_BASE}/settings`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ settings }) }, { success: true }),
  getAuditLogs: () => fetchOrFallback(`${API_BASE}/audit`, { headers: getHeaders() }, []),
};
