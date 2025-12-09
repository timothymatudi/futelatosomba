// Utility functions for formatting data

import { format, formatDistanceToNow } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return '-';

  const num = parseFloat(amount);

  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  } else if (currency === 'CDF') {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }

  return num.toLocaleString();
};

export const formatPrice = (price, listingType = 'sale', currency = 'USD') => {
  const formattedAmount = formatCurrency(price, currency);

  if (listingType === 'rent') {
    return `${formattedAmount}/month`;
  }

  return formattedAmount;
};

export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return '-';

  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return '-';
  }
};

export const formatRelativeTime = (date, locale = 'en') => {
  if (!date) return '-';

  try {
    const localeMap = {
      en: enUS,
      fr: fr
    };

    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: localeMap[locale] || enUS
    });
  } catch (error) {
    return '-';
  }
};

export const formatNumber = (num, decimals = 0) => {
  if (!num && num !== 0) return '-';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

export const formatArea = (area, unit = 'sqm') => {
  if (!area) return '-';

  const formatted = formatNumber(area);

  if (unit === 'sqm') {
    return `${formatted} m²`;
  }

  return `${formatted} ${unit}`;
};

export const formatAddress = (property) => {
  if (!property) return '';

  const parts = [];

  if (property.address) parts.push(property.address);
  if (property.commune) parts.push(property.commune);
  if (property.city) parts.push(property.city);

  return parts.join(', ');
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as +243 XX XXX XXXX for DRC numbers
  if (cleaned.startsWith('243') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }

  return phone;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + '...';
};

export const slugify = (text) => {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const capitalizeFirst = (text) => {
  if (!text) return '';

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatPropertyTitle = (property) => {
  if (!property) return '';

  const parts = [];

  if (property.bedrooms) parts.push(`${property.bedrooms} bed`);
  if (property.propertyType) parts.push(capitalizeFirst(property.propertyType));
  if (property.listingType) parts.push(`for ${capitalizeFirst(property.listingType)}`);
  if (property.commune) parts.push(`in ${property.commune}`);

  return parts.join(' ');
};

export const getPropertyUrl = (propertyId) => {
  return `/properties/${propertyId}`;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-property.jpg';

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Otherwise, construct the URL from the API base
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  // DRC phone numbers validation
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 9 && cleaned.length <= 15;
};

export const getInitials = (name) => {
  if (!name) return '';

  const parts = name.trim().split(' ');

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const extractErrorMessage = (error) => {
  if (typeof error === 'string') return error;

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
