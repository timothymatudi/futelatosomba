// Application constants for futelatosomba platform

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const PROPERTY_TYPES = {
  HOUSE: 'house',
  APARTMENT: 'apartment',
  LAND: 'land',
  COMMERCIAL: 'commercial',
  VILLA: 'villa',
  STUDIO: 'studio'
};

export const PROPERTY_TYPE_LABELS = {
  house: { en: 'House', fr: 'Maison', ln: 'Ndako' },
  apartment: { en: 'Apartment', fr: 'Appartement', ln: 'Shambre' },
  land: { en: 'Land', fr: 'Terrain', ln: 'Mabele' },
  commercial: { en: 'Commercial', fr: 'Commercial', ln: 'Commerce' },
  villa: { en: 'Villa', fr: 'Villa', ln: 'Villa' },
  studio: { en: 'Studio', fr: 'Studio', ln: 'Studio' }
};

export const LISTING_TYPES = {
  SALE: 'sale',
  RENT: 'rent'
};

export const LISTING_TYPE_LABELS = {
  sale: { en: 'For Sale', fr: 'À Vendre', ln: 'Koteka' },
  rent: { en: 'For Rent', fr: 'À Louer', ln: 'Kofuta' }
};

export const PROPERTY_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SOLD: 'sold',
  RENTED: 'rented',
  INACTIVE: 'inactive'
};

export const USER_ROLES = {
  USER: 'user',
  AGENT: 'agent',
  ADMIN: 'admin'
};

export const AMENITIES = [
  { value: 'parking', label: { en: 'Parking', fr: 'Parking', ln: 'Parking' } },
  { value: 'pool', label: { en: 'Swimming Pool', fr: 'Piscine', ln: 'Piscine' } },
  { value: 'garden', label: { en: 'Garden', fr: 'Jardin', ln: 'Elanga' } },
  { value: 'security', label: { en: 'Security', fr: 'Sécurité', ln: 'Bakengeli' } },
  { value: 'generator', label: { en: 'Generator', fr: 'Générateur', ln: 'Mashine ya kura' } },
  { value: 'wifi', label: { en: 'WiFi', fr: 'WiFi', ln: 'WiFi' } },
  { value: 'ac', label: { en: 'Air Conditioning', fr: 'Climatisation', ln: 'AC' } },
  { value: 'furnished', label: { en: 'Furnished', fr: 'Meublé', ln: 'Na biloko' } },
  { value: 'balcony', label: { en: 'Balcony', fr: 'Balcon', ln: 'Balcon' } },
  { value: 'elevator', label: { en: 'Elevator', fr: 'Ascenseur', ln: 'Ascenseur' } }
];

export const CITIES = [
  'Kinshasa',
  'Lubumbashi',
  'Mbuji-Mayi',
  'Kisangani',
  'Kananga',
  'Likasi',
  'Kolwezi',
  'Tshikapa',
  'Beni',
  'Bukavu',
  'Goma',
  'Matadi'
];

export const KINSHASA_COMMUNES = [
  'Bandalungwa',
  'Barumbu',
  'Bumbu',
  'Gombe',
  'Kalamu',
  'Kasa-Vubu',
  'Kimbanseke',
  'Kinshasa',
  'Kintambo',
  'Kisenso',
  'Lemba',
  'Limete',
  'Lingwala',
  'Makala',
  'Maluku',
  'Masina',
  'Matete',
  'Mont-Ngafula',
  'Ndjili',
  'Ngaba',
  'Ngaliema',
  'Ngiri-Ngiri',
  'Nsele',
  'Selembao'
];

export const PRICE_RANGES = [
  { min: 0, max: 50000, label: { en: 'Under $50,000', fr: 'Moins de $50,000', ln: 'Na nse ya $50,000' } },
  { min: 50000, max: 100000, label: { en: '$50,000 - $100,000', fr: '$50,000 - $100,000', ln: '$50,000 - $100,000' } },
  { min: 100000, max: 200000, label: { en: '$100,000 - $200,000', fr: '$100,000 - $200,000', ln: '$100,000 - $200,000' } },
  { min: 200000, max: 500000, label: { en: '$200,000 - $500,000', fr: '$200,000 - $500,000', ln: '$200,000 - $500,000' } },
  { min: 500000, max: 1000000, label: { en: '$500,000 - $1M', fr: '$500,000 - $1M', ln: '$500,000 - $1M' } },
  { min: 1000000, max: null, label: { en: 'Over $1M', fr: 'Plus de $1M', ln: 'Koleka $1M' } }
];

export const DRC_THEME_COLORS = {
  PRIMARY_BLUE: '#007FFF',
  SECONDARY_YELLOW: '#FFD700',
  ACCENT_RED: '#CE1126',
  TEXT_DARK: '#1a1a1a',
  TEXT_LIGHT: '#666666',
  BACKGROUND: '#ffffff',
  BACKGROUND_LIGHT: '#f5f5f5',
  BORDER: '#e0e0e0',
  SUCCESS: '#28a745',
  WARNING: '#ffc107',
  ERROR: '#dc3545',
  INFO: '#17a2b8'
};

export const CURRENCIES = {
  USD: { symbol: '$', code: 'USD' },
  CDF: { symbol: 'FC', code: 'CDF' }
};

export const LANGUAGES = {
  EN: 'en',
  FR: 'fr',
  LN: 'ln'
};

export const LANGUAGE_NAMES = {
  en: 'English',
  fr: 'Français',
  ln: 'Lingala'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48]
};

export const IMAGE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 10,
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '',
  DONATION_AMOUNTS: [5, 10, 25, 50, 100],
  PREMIUM_LISTING_PRICE: 50
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'futelatosomba_token',
  USER: 'futelatosomba_user',
  LANGUAGE: 'futelatosomba_language'
};

export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAILS: '/properties/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADD_PROPERTY: '/add-property',
  EDIT_PROPERTY: '/edit-property/:id',
  ABOUT: '/about',
  CONTACT: '/contact',
  NOT_FOUND: '*'
};
