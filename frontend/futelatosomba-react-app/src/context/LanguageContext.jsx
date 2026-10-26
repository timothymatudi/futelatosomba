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
    createAccount: 'Create your account',

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
    welcomeUser: 'Welcome, {name}!',

    // Footer
    allRightsReserved: 'All rights reserved',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',

    // About
    aboutUs: 'About Us',
    ourMission: 'Our Mission',
    ourVision: 'Our Vision',
    aboutMissionPara1: 'Futelatosomba is dedicated to revolutionizing the property market in the Democratic Republic of Congo. We provide a modern, transparent, and efficient platform connecting property seekers with owners and agents across all major cities in the DRC.',
    aboutMissionPara2: "Our mission is to make property search and listing simple, accessible, and reliable for everyone in the DRC, whether you're looking to buy, rent, or sell properties.",
    aboutVisionPara: "We envision a future where finding your dream home or perfect commercial space in the DRC is as easy as a few clicks. Through technology and innovation, we're building trust and transparency in the Congolese property market.",
    nationwideCoverage: 'Nationwide Coverage',
    nationwideCoverageText: 'Properties across all major cities in the DRC including Kinshasa, Lubumbashi, Goma, and more.',
    verifiedListings: 'Verified Listings',
    verifiedListingsText: 'All property listings are verified to ensure accuracy and authenticity.',
    professionalAgents: 'Professional Agents',
    professionalAgentsText: 'Connect with experienced property agents who understand the local market.',
    ourLeadership: 'Our Leadership',
    founderRole: 'Founder & Lead Property Specialist',
    founderBio: "This platform is dedicated to Odiber Jette, who brings many years of experience in the Democratic Republic of Congo property market. Her expertise and dedication have shaped Futelatosomba into a trusted platform for property seekers and owners across the nation.",
    multiLanguageSupport: 'Multi-Language Support',
    multiLanguageSupportText: 'Futelatosomba is available in English, French, and Lingala, making it accessible to all Congolese citizens and international visitors. We believe language should never be a barrier to finding your perfect property.',

    // Contact
    contactUs: 'Contact Us',
    contactSubtitle: "We'd love to hear from you",
    getInTouch: 'Get in Touch',
    contactInfoText: 'Have questions about listing your property or finding your dream home? Our team is here to help you every step of the way.',
    address: 'Address',
    subject: 'Subject',
    sendMessage: 'Send Message',
    message: 'Message',
    yourName: 'Your Name',
    yourEmail: 'Your Email',
    yourMessage: 'Your Message',
    messageSentSuccess: 'Message sent successfully! We will get back to you soon.',

    // Home stats & sections
    statProperties: 'Properties',
    statListings: 'Listings',
    statCities: 'Cities',
    heroSearchPlaceholder: 'Search properties...',
    viewList: 'View List',
    loadingProperties: 'Loading properties...',
    loadingMap: 'Loading map...',
    noMappedProperties: 'No mapped properties match the current filters.',
    viewAllProperties: 'View All Properties',
    ctaOwnerTitle: 'Are you a property owner or agent?',
    ctaOwnerText: 'List your properties on Futelatosomba and reach thousands of potential buyers and renters.',
    getStarted: 'Get Started',

    // PropertyDetails
    propertyNotFound: 'Property not found',
    backToHome: 'Back to Home',
    premium: 'Premium',
    views: 'Views',
    propertyLocationTitle: 'Property Location',
    similarProperties: 'Similar Properties',
    saved: 'Saved',
    saveProperty: 'Save',

    // UserDashboard
    myDashboard: 'My Dashboard',
    welcomeBackUser: 'Welcome back, {name}!',
    savedPropertiesTab: 'Saved Properties',
    savedSearchesTab: 'Saved Searches',
    recentlyViewedTab: 'Recently Viewed',
    emailAlertsTab: 'Email Alerts',
    profileSettingsTab: 'Profile Settings',
    browseMore: 'Browse More',
    browseProperties: 'Browse Properties',
    createNewSearch: 'Create New Search',
    startSearching: 'Start Searching',
    createAlert: 'Create Alert',
    searchProperties: 'Search Properties',
    noSavedProperties: 'No saved properties yet',
    noSavedPropertiesText: 'Start exploring and save your favorite properties',
    noSavedSearches: 'No saved searches yet',
    noSavedSearchesText: 'Save your search criteria to quickly find properties',
    noRecentlyViewed: 'No recently viewed properties',
    noRecentlyViewedText: 'Properties you view will appear here',
    noEmailAlerts: 'No email alerts yet',
    noEmailAlertsText: 'Create an alert from the property search filters and we will email you when matching listings appear.',
    frequency: 'Frequency',
    viewMatches: 'View matches',
    deleteAlertBtn: 'Delete alert',
    lastSent: 'Last sent',

    // MortgageCalculator
    mortgageCalculatorTitle: 'Mortgage Calculator',
    mortgageCalculatorSubtitle: 'Estimate monthly payments for DRC property purchases. Rates reflect local bank offers.',
    mortgageLoanDetails: 'Property & loan details',
    mortgageBankPreset: 'Select a DRC bank or enter a custom rate',
    mortgagePropertyPrice: 'Property price',
    mortgageDeposit: 'Deposit / down payment',
    mortgageInterestRate: 'Interest rate (%)',
    mortgageTerm: 'Mortgage term',
    mortgageTermHint: 'Max 15 years for DRC banks',
    mortgageMonthlyIncome: 'Monthly household income',
    mortgageDRCTip: 'In DRC, property transactions are typically in USD. CDF amounts are approximate based on ~2,800 FC/USD. Always confirm the rate with your bank.',
    mortgageMonthlyPayment: 'Estimated monthly payment',
    mortgagePerMonth: 'per month',
    mortgageLoanAmount: 'Loan amount',
    mortgageTotalInterest: 'Total interest',
    mortgageTotalRepayment: 'Total repayment',
    mortgageAffordabilityRatio: 'Payment / income ratio',
    mortgagePrincipal: 'Principal',
    mortgageAffordable: 'This estimate is within the 35% affordability guideline.',
    mortgageNotAffordable: 'Above 35% of income. Consider a larger deposit, lower price, or longer term.',
    mortgageDisclaimer: 'Estimate only. Actual rates, fees, insurance and exchange rates may differ. Contact your bank for a formal assessment.',
    mortgageFirstYearBreakdown: 'First-year payment breakdown (month by month)',
    mortgageMonth: 'Month',
    mortgageBalance: 'Remaining balance',
    years: 'years',

    // NotFound
    pageNotFound: 'Page Not Found',
    pageNotFoundText: "The page you're looking for doesn't exist or has been moved.",
    goHome: 'Go Home',
    goBack: 'Go Back',

    // ForgotPassword
    forgotPasswordTitle: 'Forgot Password?',
    forgotPasswordDesc: "Enter your email address and we'll send you a link to reset your password.",
    emailAddress: 'Email Address',
    enterYourEmail: 'Enter your email',
    sendResetLink: 'Send Reset Link',
    sending: 'Sending...',
    checkYourEmail: 'Check Your Email',
    checkYourEmailSent: "We've sent a password reset link to {email}. Please check your inbox and follow the instructions to reset your password.",
    didntReceiveEmail: "Didn't receive the email?",
    tipCheckSpam: 'Check your spam or junk folder',
    tipCheckEmailAddress: 'Make sure you entered the correct email address',
    tipWaitMinutes: 'Wait a few minutes and check again',
    tryDifferentEmail: 'Try Different Email',
    backToLogin: 'Back to Login',

    // ResetPassword
    resetPasswordTitle: 'Reset Password',
    resetPasswordDesc: 'Enter your new password below',
    newPassword: 'New Password',
    enterNewPassword: 'Enter new password',
    passwordMinLength: 'Must be at least 8 characters',
    confirmPasswordPlaceholder: 'Confirm new password',
    resettingPassword: 'Resetting Password...',
    resetPasswordBtn: 'Reset Password',
    rememberPassword: 'Remember your password?',

    // VerifyEmail
    verifyingEmail: 'Verifying Your Email...',
    emailVerifiedTitle: 'Email Verified!',
    verificationFailedTitle: 'Verification Failed',
    goToLogin: 'Go to Login',
    resendVerificationEmail: 'Resend Verification Email',
    tryLoggingIn: 'Try Logging In',
    pleaseWaitVerify: 'Please wait while we verify your email...',
    needHelp: 'Need help?',
    contactSupport: 'Contact Support',

    // Nav (previously hardcoded)
    findAgents: 'Find Agents',
    soldPrices: 'Sold Prices',
    valuation: 'Valuation',
    mortgage: 'Mortgage',

    // Filters
    all: 'All',
    allCities: 'All Cities',
    allCommunes: 'All Communes',
    any: 'Any',
    allTypes: 'All Types',
    statusActive: 'Active',
    statusSold: 'Sold',
    statusRented: 'Rented',
    createEmailAlert: 'Create Email Alert',
    features: 'Features',
    amenities: 'Amenities',
    featuresPlaceholder: 'e.g. pool, garden, parking',
    amenitiesPlaceholder: 'e.g. school, hospital nearby',
    minYearBuilt: 'Min Year Built',
    maxYearBuilt: 'Max Year Built',
    minYear: 'Min year',
    maxYear: 'Max year',
    status: 'Listing Status',
    premiumListings: 'Premium listings only',
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
    forgotPassword: 'Mot de passe oublié ?',
    dontHaveAccount: "Vous n'avez pas de compte ?",
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    createAccount: 'Créer votre compte',

    // Dashboard
    profile: 'Profil',
    myListings: 'Mes Annonces',
    favorites: 'Favoris',
    messages: 'Messages',
    settings: 'Paramètres',

    // Messages
    welcome: 'Bienvenue à Futelatosomba',
    findYourDreamHome: 'Trouvez la maison de vos rêves en RDC',
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
    welcomeUser: 'Bienvenue, {name}!',

    // Footer
    allRightsReserved: 'Tous droits réservés',
    privacyPolicy: 'Politique de Confidentialité',
    termsOfService: "Conditions d'Utilisation",

    // About
    aboutUs: 'À Propos de Nous',
    ourMission: 'Notre Mission',
    ourVision: 'Notre Vision',
    aboutMissionPara1: "Futelatosomba se consacre à révolutionner le marché immobilier en République Démocratique du Congo. Nous offrons une plateforme moderne, transparente et efficace qui met en relation les chercheurs de propriétés avec les propriétaires et les agents dans toutes les grandes villes de la RDC.",
    aboutMissionPara2: "Notre mission est de rendre la recherche et la publication de propriétés simple, accessible et fiable pour tous en RDC, que vous cherchiez à acheter, louer ou vendre des propriétés.",
    aboutVisionPara: "Nous imaginons un avenir où trouver votre maison de rêve ou le parfait espace commercial en RDC est aussi simple que quelques clics. Grâce à la technologie et à l'innovation, nous construisons la confiance et la transparence dans le marché immobilier congolais.",
    nationwideCoverage: 'Couverture Nationale',
    nationwideCoverageText: 'Propriétés dans toutes les grandes villes de la RDC, notamment Kinshasa, Lubumbashi, Goma, et plus encore.',
    verifiedListings: 'Annonces Vérifiées',
    verifiedListingsText: 'Toutes les annonces immobilières sont vérifiées pour garantir leur exactitude et leur authenticité.',
    professionalAgents: 'Agents Professionnels',
    professionalAgentsText: 'Connectez-vous avec des agents immobiliers expérimentés qui comprennent le marché local.',
    ourLeadership: 'Notre Direction',
    founderRole: 'Fondatrice et Spécialiste Immobilière Principale',
    founderBio: "Cette plateforme est dédiée à Odiber Jette, qui apporte de nombreuses années d'expérience sur le marché immobilier de la République Démocratique du Congo. Son expertise et son dévouement ont façonné Futelatosomba en une plateforme de confiance pour les chercheurs et propriétaires de biens immobiliers à travers le pays.",
    multiLanguageSupport: 'Support Multilingue',
    multiLanguageSupportText: "Futelatosomba est disponible en anglais, français et lingala, le rendant accessible à tous les citoyens congolais et aux visiteurs internationaux. Nous croyons que la langue ne devrait jamais être un obstacle pour trouver votre propriété idéale.",

    // Contact
    contactUs: 'Contactez-Nous',
    contactSubtitle: 'Nous serions ravis de vous entendre',
    getInTouch: 'Prendre Contact',
    contactInfoText: "Des questions sur la publication de votre propriété ou la recherche de votre maison idéale? Notre équipe est là pour vous aider à chaque étape.",
    address: 'Adresse',
    subject: 'Sujet',
    sendMessage: 'Envoyer un Message',
    message: 'Message',
    yourName: 'Votre Nom',
    yourEmail: 'Votre Email',
    yourMessage: 'Votre Message',
    messageSentSuccess: 'Message envoyé avec succès! Nous vous répondrons bientôt.',

    // Home stats & sections
    statProperties: 'Propriétés',
    statListings: 'Annonces',
    statCities: 'Villes',
    heroSearchPlaceholder: 'Rechercher des propriétés...',
    viewList: 'Vue Liste',
    loadingProperties: 'Chargement des propriétés...',
    loadingMap: 'Chargement de la carte...',
    noMappedProperties: 'Aucune propriété sur la carte ne correspond aux filtres actuels.',
    viewAllProperties: 'Voir Toutes les Propriétés',
    ctaOwnerTitle: 'Êtes-vous propriétaire ou agent immobilier?',
    ctaOwnerText: "Publiez vos propriétés sur Futelatosomba et atteignez des milliers d'acheteurs et locataires potentiels.",
    getStarted: 'Commencer',

    // PropertyDetails
    propertyNotFound: 'Propriété non trouvée',
    backToHome: "Retour à l'Accueil",
    premium: 'Premium',
    views: 'Vues',
    propertyLocationTitle: 'Localisation de la Propriété',
    similarProperties: 'Propriétés Similaires',
    saved: 'Sauvegardé',
    saveProperty: 'Sauvegarder',

    // UserDashboard
    myDashboard: 'Mon Tableau de Bord',
    welcomeBackUser: 'Bon retour, {name}!',
    savedPropertiesTab: 'Propriétés Sauvegardées',
    savedSearchesTab: 'Recherches Sauvegardées',
    recentlyViewedTab: 'Vus Récemment',
    emailAlertsTab: 'Alertes Email',
    profileSettingsTab: 'Paramètres du Profil',
    browseMore: 'Explorer Plus',
    browseProperties: 'Explorer les Propriétés',
    createNewSearch: 'Nouvelle Recherche',
    startSearching: 'Commencer à Chercher',
    createAlert: 'Créer une Alerte',
    searchProperties: 'Rechercher des Propriétés',
    noSavedProperties: 'Aucune propriété sauvegardée',
    noSavedPropertiesText: 'Explorez et sauvegardez vos propriétés favorites',
    noSavedSearches: 'Aucune recherche sauvegardée',
    noSavedSearchesText: 'Sauvegardez vos critères de recherche pour trouver rapidement des propriétés',
    noRecentlyViewed: 'Aucune propriété vue récemment',
    noRecentlyViewedText: 'Les propriétés que vous consultez apparaîtront ici',
    noEmailAlerts: 'Aucune alerte email',
    noEmailAlertsText: 'Créez une alerte depuis les filtres de recherche et nous vous enverrons un email dès que des annonces correspondantes apparaissent.',
    frequency: 'Fréquence',
    viewMatches: 'Voir les correspondances',
    deleteAlertBtn: "Supprimer l'alerte",
    lastSent: 'Dernier envoi',

    // MortgageCalculator
    mortgageCalculatorTitle: 'Calculateur de Prêt Immobilier',
    mortgageCalculatorSubtitle: 'Estimez vos mensualités pour un achat immobilier en RDC. Taux reflétant les offres bancaires locales.',
    mortgageLoanDetails: 'Détails du bien et du prêt',
    mortgageBankPreset: 'Choisissez une banque RDC ou saisissez un taux',
    mortgagePropertyPrice: 'Prix du bien',
    mortgageDeposit: 'Apport / acompte',
    mortgageInterestRate: 'Taux d\'intérêt (%)',
    mortgageTerm: 'Durée du prêt',
    mortgageTermHint: 'Maximum 15 ans pour les banques RDC',
    mortgageMonthlyIncome: 'Revenu mensuel du ménage',
    mortgageDRCTip: 'En RDC, les transactions immobilières se font généralement en USD. Les montants en CDF sont approximatifs (~2 800 FC/USD). Confirmez le taux avec votre banque.',
    mortgageMonthlyPayment: 'Mensualité estimée',
    mortgagePerMonth: 'par mois',
    mortgageLoanAmount: 'Montant emprunté',
    mortgageTotalInterest: 'Intérêts totaux',
    mortgageTotalRepayment: 'Coût total',
    mortgageAffordabilityRatio: 'Taux d\'endettement',
    mortgagePrincipal: 'Capital',
    mortgageAffordable: 'Cette estimation est dans la limite conseillée de 35% des revenus.',
    mortgageNotAffordable: 'Au-dessus de 35% des revenus. Envisagez un apport plus élevé, un prix inférieur ou une durée plus longue.',
    mortgageDisclaimer: 'Estimation uniquement. Les taux réels, frais et taux de change peuvent différer. Contactez votre banque pour une évaluation formelle.',
    mortgageFirstYearBreakdown: 'Tableau d\'amortissement — première année',
    mortgageMonth: 'Mois',
    mortgageBalance: 'Capital restant',
    years: 'ans',

    // NotFound
    pageNotFound: 'Page Non Trouvée',
    pageNotFoundText: "La page que vous recherchez n'existe pas ou a été déplacée.",
    goHome: "Aller à l'Accueil",
    goBack: 'Retour',

    // ForgotPassword
    forgotPasswordTitle: 'Mot de Passe Oublié ?',
    forgotPasswordDesc: "Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
    emailAddress: 'Adresse Email',
    enterYourEmail: 'Entrez votre email',
    sendResetLink: 'Envoyer le Lien',
    sending: 'Envoi...',
    checkYourEmail: 'Vérifiez Votre Email',
    checkYourEmailSent: "Nous avons envoyé un lien de réinitialisation à {email}. Veuillez vérifier votre boîte de réception et suivre les instructions.",
    didntReceiveEmail: "Vous n'avez pas reçu l'email?",
    tipCheckSpam: 'Vérifiez votre dossier spam ou courrier indésirable',
    tipCheckEmailAddress: "Assurez-vous d'avoir entré la bonne adresse email",
    tipWaitMinutes: 'Attendez quelques minutes et vérifiez à nouveau',
    tryDifferentEmail: 'Essayer un Autre Email',
    backToLogin: 'Retour à la Connexion',

    // ResetPassword
    resetPasswordTitle: 'Réinitialiser le Mot de Passe',
    resetPasswordDesc: 'Entrez votre nouveau mot de passe ci-dessous',
    newPassword: 'Nouveau Mot de Passe',
    enterNewPassword: 'Entrez le nouveau mot de passe',
    passwordMinLength: 'Doit avoir au moins 8 caractères',
    confirmPasswordPlaceholder: 'Confirmez le nouveau mot de passe',
    resettingPassword: 'Réinitialisation...',
    resetPasswordBtn: 'Réinitialiser le Mot de Passe',
    rememberPassword: 'Vous vous souvenez de votre mot de passe?',

    // VerifyEmail
    verifyingEmail: 'Vérification de votre email...',
    emailVerifiedTitle: 'Email Vérifié!',
    verificationFailedTitle: 'Échec de la Vérification',
    goToLogin: 'Aller à la Connexion',
    resendVerificationEmail: "Renvoyer l'Email de Vérification",
    tryLoggingIn: 'Essayer de Se Connecter',
    pleaseWaitVerify: 'Veuillez patienter pendant la vérification de votre email...',
    needHelp: "Besoin d'aide ?",
    contactSupport: 'Contacter le Support',

    // Nav & Filters (previously missing)
    findAgents: 'Trouver des Agents',
    soldPrices: 'Prix de Vente',
    valuation: 'Estimation',
    mortgage: 'Prêt Immobilier',
    all: 'Tous',
    allCities: 'Toutes les Villes',
    allCommunes: 'Toutes les Communes',
    any: 'Peu importe',
    statusActive: 'Actif',
    statusSold: 'Vendu',
    statusRented: 'Loué',
    createEmailAlert: 'Créer une Alerte Email',
    features: 'Caractéristiques',
    featuresPlaceholder: 'ex. piscine, jardin, parking',
    amenitiesPlaceholder: 'ex. école, hôpital à proximité',
    minYearBuilt: 'Année de construction min',
    maxYearBuilt: 'Année de construction max',
    minYear: 'Année min',
    maxYear: 'Année max',
    status: "Statut de l'annonce",
    premiumListings: 'Annonces premium uniquement',
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
    createAccount: 'Sala Compte na Yo',

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
    welcomeUser: 'Boyei Malamu, {name}!',

    // Footer
    allRightsReserved: 'Makoki nyonso ebombami',
    privacyPolicy: 'Politique ya Secret',
    termsOfService: 'Mibeko',

    // About
    aboutUs: 'Likambo ya Biso',
    ourMission: 'Mission na Biso',
    ourVision: 'Vision na Biso',
    aboutMissionPara1: 'Futelatosomba ezali koluka kobongola esika ya bandako na Republique Democratique ya Congo. Tozali kopesa plateforme ya sika, ya polele mpe ya malamu oyo ekutanisa bato oyo baluki bandako na bato ya bandako mpe ba agent na mingomba nyonso ya RDC.',
    aboutMissionPara2: 'Mission na biso ezali kosala ete koluka mpe kotiya bandako ezala pɛtɛ, ezo kogumba mpe ya solo mpo na bato nyonso na RDC, soki oluki kosomba, kofuta to koteka bandako.',
    aboutVisionPara: 'Tomonaka liboso esika oyo kozwa ndako ya ndoto na yo to esika ya biznis na RDC ekozala pɛtɛ lokola clic moke. Na nzela ya teknoloji, tozali kotonga kondima mpe polele na esika ya bandako ya Kongo.',
    nationwideCoverage: 'Mingomba Nionso',
    nationwideCoverageText: 'Bandako na mingomba nyonso ya RDC: Kinshasa, Lubumbashi, Goma, mpe mingi.',
    verifiedListings: 'Bandako Ekanisami',
    verifiedListingsText: 'Bandako nyonso ekanisami mpo na solo mpe bosolo.',
    professionalAgents: 'Ba Agent ya Solo',
    professionalAgentsText: 'Kutana na ba agent ya bandako oyo bayebi esika ya liboso.',
    ourLeadership: 'Bokonzi na Biso',
    founderRole: 'Moto ya Liboso & Spécialiste ya Bandako',
    founderBio: 'Plateforme oyo etyelemi mpo na Odiber Jette, oyo azali na mbula mingi ya makoki na esika ya bandako ya RDC. Boyebi mpe bolingo na ye esalisi Futelatosomba kozala plateforme ya kondima mpo na bato nyonso na ekolo.',
    multiLanguageSupport: 'Minoko Mingi',
    multiLanguageSupportText: 'Futelatosomba ezali na Lingelesi, Français mpe Lingala, mpo na bato nyonso ya Kongo mpe bato ya mboka mosusu. Tokanisi ete lolemu ekoki te kozalisa nkango ya kozwa ndako na yo ya kitoko.',

    // Contact
    contactUs: 'Bengi Biso',
    contactSubtitle: 'Tolingaka koyoka yo',
    getInTouch: 'Kokutana na Biso',
    contactInfoText: 'Ozali na mituna mpo na kotiya ndako na yo to koluka ndako ya yo? Biso tozali awa mpo na kosalisa yo na etape nyonso.',
    address: 'Adresse',
    subject: 'Likambo',
    sendMessage: 'Tinda Sango',
    message: 'Sango',
    yourName: 'Nkombo na Yo',
    yourEmail: 'Email na Yo',
    yourMessage: 'Sango na Yo',
    messageSentSuccess: 'Sango etindami malamu! Tokozongela yo nokinoki.',

    // Home stats & sections
    statProperties: 'Bandako',
    statListings: 'Babongisi',
    statCities: 'Mingomba',
    heroSearchPlaceholder: 'Koluka bandako...',
    viewList: 'Komona Liste',
    loadingProperties: 'Kokanga bandako...',
    loadingMap: 'Kokanga carte...',
    noMappedProperties: 'Bandako ezali te na carte oyo ekokani na boponi.',
    viewAllProperties: 'Komona Bandako Nyonso',
    ctaOwnerTitle: 'Ozali moto ya ndako to agent?',
    ctaOwnerText: 'Tiya bandako na yo na Futelatosomba mpe kokutana na bato mingi oyo balingi kosomba to kofuta.',
    getStarted: 'Kobanda',

    // PropertyDetails
    propertyNotFound: 'Ndako ezwami te',
    backToHome: 'Kozonga Ndako',
    premium: 'Ya Kitoko',
    views: 'Bato Bamoni',
    propertyLocationTitle: 'Esika ya Ndako',
    similarProperties: 'Bandako Lokola Oyo',
    saved: 'Ebombami',
    saveProperty: 'Kobomba',

    // UserDashboard
    myDashboard: 'Tableau na Ngai',
    welcomeBackUser: 'Boyei Malamu, {name}!',
    savedPropertiesTab: 'Bandako Ebombami',
    savedSearchesTab: 'Biluka Ebombami',
    recentlyViewedTab: "Emoni Sik'oyo",
    emailAlertsTab: 'Bilamba ya Email',
    profileSettingsTab: 'Paramètres ya Profil',
    browseMore: 'Kotala Lisusu',
    browseProperties: 'Kotala Bandako',
    createNewSearch: 'Luka Mpo ya Sika',
    startSearching: 'Kobanda Koluka',
    createAlert: 'Sala Elembo',
    searchProperties: 'Koluka Bandako',
    noSavedProperties: 'Bandako ebombami ezali te',
    noSavedPropertiesText: 'Tala mpe bomba bandako oyo olingaka',
    noSavedSearches: 'Biluka ebombami ezali te',
    noSavedSearchesText: 'Bomba biluka na yo mpo na kozwa nokinoki bandako',
    noRecentlyViewed: 'Omoni eloko moko te sik\'oyo',
    noRecentlyViewedText: 'Bandako oyo omoni ekozala awa',
    noEmailAlerts: 'Bilamba ya email ezali te',
    noEmailAlertsText: 'Sala elembo uta na boponi ya koluka mpe tokotumelela yo email ntango bandako ya ndenge moko eyaki.',
    frequency: 'Mbala na Mbala',
    viewMatches: 'Komona oyo ekokani',
    deleteAlertBtn: 'Kolongola elembo',
    lastSent: 'Etindami nsuka',

    // MortgageCalculator
    mortgageCalculatorTitle: 'Kalikilatele ya Lisanso ya Ndako',
    mortgageCalculatorSubtitle: 'Yeba ntalo ya sanza na sanza mpo na koyamba ndako na RDC.',
    mortgageLoanDetails: 'Makambo ya ndako na lisanso',
    mortgageBankPreset: 'Pona banki ya RDC to kotia taux na yo moko',
    mortgagePropertyPrice: 'Prix ya ndako',
    mortgageDeposit: 'Avance / dépôt',
    mortgageInterestRate: 'Taux ya litomba (%)',
    mortgageTerm: 'Ntango ya lisanso',
    mortgageTermHint: 'Mpo na banki ya RDC: mbula 15 koleka te',
    mortgageMonthlyIncome: 'Mbongo ya libota sanza na sanza',
    mortgageDRCTip: 'Na RDC, biloko ya ndako ezali USD. FC esalemi na ~2.800 FC/USD. Tuni banki na yo mpo na taux ya solosolo.',
    mortgageMonthlyPayment: 'Ntalo ya sanza na sanza',
    mortgagePerMonth: 'sanza na sanza',
    mortgageLoanAmount: 'Montant ya lisanso',
    mortgageTotalInterest: 'Litomba nyonso',
    mortgageTotalRepayment: 'Ntalo ya mobimba',
    mortgageAffordabilityRatio: 'Proportion ya mbongo / ntalo',
    mortgagePrincipal: 'Capital',
    mortgageAffordable: 'Estimation oyo ezali na nse ya 35% ya mbongo — malamu.',
    mortgageNotAffordable: 'Eleki 35% ya mbongo. Tia avance minene to pona ndako ya ntalo mike.',
    mortgageDisclaimer: 'Estimation kaka. Taux ya solosolo na banki ekoki kobanda. Tuni banki na yo.',
    mortgageFirstYearBreakdown: 'Tableau ya mbula ya liboso — sanza na sanza',
    mortgageMonth: 'Sanza',
    mortgageBalance: 'Capital ekosalela',
    years: 'mbula',

    // NotFound
    pageNotFound: 'Lokasa Ezwami Te',
    pageNotFoundText: "Lokasa oyo oluki ezali te to ekangami.",
    goHome: 'Kozonga Ndako',
    goBack: 'Kozonga Nsima',

    // ForgotPassword
    forgotPasswordTitle: 'Obosani Mot de Passe?',
    forgotPasswordDesc: 'Tiya adresse ya email na yo mpe tokotumelela yo lien ya kobongola mot de passe.',
    emailAddress: 'Adresse ya Email',
    enterYourEmail: 'Tiya email na yo',
    sendResetLink: 'Tinda Lien',
    sending: 'Kotinda...',
    checkYourEmail: 'Tala Email na Yo',
    checkYourEmailSent: 'Totindeli yo lien ya kobongola na {email}. Tala boîte ya yo mpelanda malako.',
    didntReceiveEmail: 'Ozwi email te?',
    tipCheckSpam: 'Tala dossier spam na yo',
    tipCheckEmailAddress: 'Kangisa ete otiyaki adresse ya malamu',
    tipWaitMinutes: 'Linda miniti moke mpe tala lisusu',
    tryDifferentEmail: 'Leka Email Mosusu',
    backToLogin: 'Kozonga Kokota',

    // ResetPassword
    resetPasswordTitle: 'Kobongola Mot de Passe',
    resetPasswordDesc: 'Tiya mot de passe ya sika awa na nse',
    newPassword: 'Mot de Passe ya Sika',
    enterNewPassword: 'Tiya mot de passe ya sika',
    passwordMinLength: 'Esengeli kozala na minimo 8 ba caractère',
    confirmPasswordPlaceholder: 'Ndimisa mot de passe ya sika',
    resettingPassword: 'Kobongola...',
    resetPasswordBtn: 'Kobongola Mot de Passe',
    rememberPassword: 'Ozali koyeba mot de passe na yo?',

    // VerifyEmail
    verifyingEmail: 'Kokanisa email na yo...',
    emailVerifiedTitle: 'Email Ekanisami!',
    verificationFailedTitle: 'Kokanisa Ekoseli',
    goToLogin: 'Kokota',
    resendVerificationEmail: 'Tinda Lisusu Email ya Kokanisa',
    tryLoggingIn: 'Leka Kokota',
    pleaseWaitVerify: 'Linda mwa ntango tikanisa email na yo...',
    needHelp: 'Ozali na problem ?',
    contactSupport: 'Bengi Biso',

    // Nav & Filters (previously missing)
    findAgents: 'Luka Ba Agent',
    soldPrices: 'Ntalo ya Bandako Etekamaki',
    valuation: 'Kokakatisa Ntalo',
    mortgage: 'Lisanso ya Ndako',
    all: 'Nyonso',
    allCities: 'Mingomba Nyonso',
    allCommunes: 'Bacommune Nyonso',
    any: 'Oyo Nyonso',
    statusActive: 'Ezali Kokende',
    statusSold: 'Etekamaki',
    statusRented: 'Efutamaki',
    createEmailAlert: 'Sala Elembo ya Email',
    features: 'Biloko ya Ndako',
    featuresPlaceholder: 'ndakisa: piscine, jardin, parking',
    amenitiesPlaceholder: 'ndakisa: école, hôpital pene',
    minYearBuilt: 'Mbula ya Kotonga (moke)',
    maxYearBuilt: 'Mbula ya Kotonga (mingi)',
    minYear: 'Mbula moke',
    maxYear: 'Mbula mingi',
    status: 'État ya Bongisi',
    premiumListings: 'Bandako ya kitoko kaka',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(LANGUAGES.EN);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE);
    if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    if (Object.values(LANGUAGES).includes(newLanguage)) {
      setLanguage(newLanguage);
      localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, newLanguage);
    }
  };

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
      let result = translation;
      Object.keys(params).forEach(param => {
        result = result.replace(`{${param}}`, params[param]);
      });
      return result;
    }

    // Fallback to English
    let fallback = translations[LANGUAGES.EN];
    for (const k of keys) {
      if (fallback && typeof fallback === 'object') {
        fallback = fallback[k];
      } else {
        return key;
      }
    }

    return fallback || key;
  };

  const getLabel = (labelObj, defaultValue = '') => {
    if (!labelObj) return defaultValue;
    if (typeof labelObj === 'string') return labelObj;
    return labelObj[language] || labelObj[LANGUAGES.EN] || defaultValue;
  };

  const value = { language, changeLanguage, t, getLabel };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageContext;
