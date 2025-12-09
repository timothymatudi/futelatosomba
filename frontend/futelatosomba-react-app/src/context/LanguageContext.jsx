import React, { createContext, useState, useContext, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, LANGUAGES } from '../utils/constants';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionary
const translations = {
  en: {
    // Navigation
    home: 'Home',
    properties: 'Properties',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',

    // Common
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    submit: 'Submit',
    loading: 'Loading...',
    noResults: 'No results found',
    showMore: 'Show More',
    showLess: 'Show Less',

    // Property
    propertyDetails: 'Property Details',
    propertyType: 'Property Type',
    listingType: 'Listing Type',
    price: 'Price',
    location: 'Location',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    area: 'Area',
    description: 'Description',
    amenities: 'Amenities',
    contactAgent: 'Contact Agent',
    viewMap: 'View Map',
    addProperty: 'Add Property',
    editProperty: 'Edit Property',
    myProperties: 'My Properties',
    featured: 'Featured',

    // Filters
    allTypes: 'All Types',
    forSale: 'For Sale',
    forRent: 'For Rent',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    city: 'City',
    commune: 'Commune',
    applyFilters: 'Apply Filters',
    resetFilters: 'Reset Filters',

    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phone: 'Phone Number',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',

    // Dashboard
    profile: 'Profile',
    myListings: 'My Listings',
    favorites: 'Favorites',
    messages: 'Messages',
    settings: 'Settings',

    // Messages
    welcome: 'Welcome to Futelatosomba',
    findYourDreamHome: 'Find Your Dream Home in DRC',
    propertyPlatform: 'The Leading Property Platform in Democratic Republic of Congo',

    // Errors
    requiredField: 'This field is required',
    invalidEmail: 'Invalid email address',
    passwordMismatch: 'Passwords do not match',
    minLength: 'Minimum length is',
    maxLength: 'Maximum length is',

    // Success
    loginSuccess: 'Login successful!',
    registerSuccess: 'Registration successful!',
    updateSuccess: 'Updated successfully!',
    deleteSuccess: 'Deleted successfully!',

    // Footer
    allRightsReserved: 'All rights reserved',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',

    // About
    aboutUs: 'About Us',
    ourMission: 'Our Mission',
    ourVision: 'Our Vision',

    // Contact
    contactUs: 'Contact Us',
    sendMessage: 'Send Message',
    message: 'Message',
    yourName: 'Your Name',
    yourEmail: 'Your Email',
    yourMessage: 'Your Message'
  },

  fr: {
    // Navigation
    home: 'Accueil',
    properties: 'Propriétés',
    about: 'À Propos',
    contact: 'Contact',
    login: 'Connexion',
    register: "S'inscrire",
    dashboard: 'Tableau de Bord',
    logout: 'Déconnexion',

    // Common
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    submit: 'Soumettre',
    loading: 'Chargement...',
    noResults: 'Aucun résultat trouvé',
    showMore: 'Voir Plus',
    showLess: 'Voir Moins',

    // Property
    propertyDetails: 'Détails de la Propriété',
    propertyType: 'Type de Propriété',
    listingType: "Type d'Annonce",
    price: 'Prix',
    location: 'Localisation',
    bedrooms: 'Chambres',
    bathrooms: 'Salles de Bain',
    area: 'Surface',
    description: 'Description',
    amenities: 'Commodités',
    contactAgent: "Contacter l'Agent",
    viewMap: 'Voir la Carte',
    addProperty: 'Ajouter une Propriété',
    editProperty: 'Modifier la Propriété',
    myProperties: 'Mes Propriétés',
    featured: 'En Vedette',

    // Filters
    allTypes: 'Tous les Types',
    forSale: 'À Vendre',
    forRent: 'À Louer',
    minPrice: 'Prix Min',
    maxPrice: 'Prix Max',
    city: 'Ville',
    commune: 'Commune',
    applyFilters: 'Appliquer les Filtres',
    resetFilters: 'Réinitialiser les Filtres',

    // Auth
    email: 'Email',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    fullName: 'Nom Complet',
    phone: 'Numéro de Téléphone',
    forgotPassword: 'Mot de passe oublié?',
    dontHaveAccount: "Vous n'avez pas de compte?",
    alreadyHaveAccount: 'Vous avez déjà un compte?',

    // Dashboard
    profile: 'Profil',
    myListings: 'Mes Annonces',
    favorites: 'Favoris',
    messages: 'Messages',
    settings: 'Paramètres',

    // Messages
    welcome: 'Bienvenue à Futelatosomba',
    findYourDreamHome: 'Trouvez la Maison de Vos Rêves en RDC',
    propertyPlatform: 'La Plateforme Immobilière Leader en République Démocratique du Congo',

    // Errors
    requiredField: 'Ce champ est requis',
    invalidEmail: 'Adresse email invalide',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    minLength: 'La longueur minimale est',
    maxLength: 'La longueur maximale est',

    // Success
    loginSuccess: 'Connexion réussie!',
    registerSuccess: 'Inscription réussie!',
    updateSuccess: 'Mis à jour avec succès!',
    deleteSuccess: 'Supprimé avec succès!',

    // Footer
    allRightsReserved: 'Tous droits réservés',
    privacyPolicy: 'Politique de Confidentialité',
    termsOfService: "Conditions d'Utilisation",

    // About
    aboutUs: 'À Propos de Nous',
    ourMission: 'Notre Mission',
    ourVision: 'Notre Vision',

    // Contact
    contactUs: 'Contactez-Nous',
    sendMessage: 'Envoyer un Message',
    message: 'Message',
    yourName: 'Votre Nom',
    yourEmail: 'Votre Email',
    yourMessage: 'Votre Message'
  },

  ln: {
    // Navigation
    home: 'Ndako',
    properties: 'Bandako',
    about: 'Likambo ya Biso',
    contact: 'Kopesa Sango',
    login: 'Kokota',
    register: 'Komikoma',
    dashboard: 'Tableau',
    logout: 'Kobima',

    // Common
    search: 'Koluka',
    filter: 'Kopona',
    sort: 'Kobongisa',
    save: 'Kobomba',
    cancel: 'Kotika',
    delete: 'Kolongola',
    edit: 'Kobongola',
    view: 'Komona',
    submit: 'Kotinda',
    loading: 'Ezali kokanga...',
    noResults: 'Eloko moko te',
    showMore: 'Komona Mingi',
    showLess: 'Komona Moke',

    // Property
    propertyDetails: 'Makambo ya Ndako',
    propertyType: 'Lolenge ya Ndako',
    listingType: 'Lolenge ya Koteka',
    price: 'Ntalo',
    location: 'Esika',
    bedrooms: 'Bashambre',
    bathrooms: 'Bain',
    area: 'Bonene',
    description: 'Ndembo',
    amenities: 'Biloko',
    contactAgent: 'Bengi Agent',
    viewMap: 'Komona Carte',
    addProperty: 'Kobakisa Ndako',
    editProperty: 'Kobongola Ndako',
    myProperties: 'Bandako na Ngai',
    featured: 'Ya Kitoko',

    // Filters
    allTypes: 'Lolenge Nionso',
    forSale: 'Koteka',
    forRent: 'Kofuta',
    minPrice: 'Ntalo Moke',
    maxPrice: 'Ntalo Mingi',
    city: 'Engumba',
    commune: 'Commune',
    applyFilters: 'Kopona',
    resetFilters: 'Kolongola Boponi',

    // Auth
    email: 'Email',
    password: 'Mot de Passe',
    confirmPassword: 'Ndimisa Mot de Passe',
    fullName: 'Nkombo Mobimba',
    phone: 'Numéro ya Telefone',
    forgotPassword: 'Obosani Mot de Passe?',
    dontHaveAccount: 'Ozali na Compte te?',
    alreadyHaveAccount: 'Ozali na Compte?',

    // Dashboard
    profile: 'Profil',
    myListings: 'Bandako na Ngai',
    favorites: 'Oyo Nalingaka',
    messages: 'Basango',
    settings: 'Paramètres',

    // Messages
    welcome: 'Boyei Malamu na Futelatosomba',
    findYourDreamHome: 'Luka Ndako ya Ndoto na Yo na RDC',
    propertyPlatform: 'Plateforme ya Bandako ya Liboso na Congo',

    // Errors
    requiredField: 'Esengeli kotya',
    invalidEmail: 'Email ya Malamu te',
    passwordMismatch: 'Mot de Passe ekokani te',
    minLength: 'Bolai moke',
    maxLength: 'Bolai mingi',

    // Success
    loginSuccess: 'Kokota malamu!',
    registerSuccess: 'Komikoma malamu!',
    updateSuccess: 'Kobongola malamu!',
    deleteSuccess: 'Kolongola malamu!',

    // Footer
    allRightsReserved: 'Makoki nyonso ebombami',
    privacyPolicy: 'Politique ya Secret',
    termsOfService: 'Mibeko',

    // About
    aboutUs: 'Likambo ya Biso',
    ourMission: 'Mission na Biso',
    ourVision: 'Vision na Biso',

    // Contact
    contactUs: 'Bengi Biso',
    sendMessage: 'Tinda Sango',
    message: 'Sango',
    yourName: 'Nkombo na Yo',
    yourEmail: 'Email na Yo',
    yourMessage: 'Sango na Yo'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(LANGUAGES.EN);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE);
    if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Change language
  const changeLanguage = (newLanguage) => {
    if (Object.values(LANGUAGES).includes(newLanguage)) {
      setLanguage(newLanguage);
      localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, newLanguage);
    }
  };

  // Get translation
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = translations[language];

    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k];
      } else {
        translation = undefined;
        break;
      }
    }

    if (typeof translation === 'string') {
      // Replace parameters in translation
      let result = translation;
      Object.keys(params).forEach(param => {
        result = result.replace(`{${param}}`, params[param]);
      });
      return result;
    }

    // Fallback to English if translation not found
    let fallback = translations[LANGUAGES.EN];
    for (const k of keys) {
      if (fallback && typeof fallback === 'object') {
        fallback = fallback[k];
      } else {
        return key; // Return key if no translation found
      }
    }

    return fallback || key;
  };

  // Get label from object with language keys
  const getLabel = (labelObj, defaultValue = '') => {
    if (!labelObj) return defaultValue;

    if (typeof labelObj === 'string') return labelObj;

    return labelObj[language] || labelObj[LANGUAGES.EN] || defaultValue;
  };

  const value = {
    language,
    changeLanguage,
    t,
    getLabel
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageContext;
