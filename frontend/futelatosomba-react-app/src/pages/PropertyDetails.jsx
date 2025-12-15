import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import propertyService from '../services/propertyService';
import PropertyGallery from '../components/property/PropertyGallery';
import PropertyInfo from '../components/property/PropertyInfo';
import ContactAgentCard from '../components/property/ContactAgentCard';
import ShareButtons from '../components/property/ShareButtons';
import Loading from '../components/common/Loading';
import { formatPrice, formatAddress } from '../utils/formatters';
import { LISTING_TYPE_LABELS } from '../utils/constants';
import { toast } from 'react-toastify';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getLabel } = useLanguage();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  const fetchPropertyDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await propertyService.getPropertyById(id);
      setProperty(data.data);

      // Check if property is in user's favorites
      if (user && data.data.favorites && data.data.favorites.includes(user._id)) {
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate, setIsFavorited]); // Dependencies of fetchPropertyDetails

  useEffect(() => {
    fetchPropertyDetails();
  }, [fetchPropertyDetails]); // fetchPropertyDetails is now a stable dependency

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.info('Please login to save properties');
      navigate('/login');
      return;
    }

    try {
      if (isFavorited) {
        await propertyService.removeFromFavorites(property._id);
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await propertyService.addToFavorites(property._id);
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!property) {
    return (
      <div className="property-not-found">
        <h2>Property not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="property-details-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">/</span>
        <Link to="/properties">Properties</Link>
        <span className="separator">/</span>
        <span className="current">{property.title}</span>
      </div>

      {/* Property Header */}
      <div className="property-header">
        <div className="property-title-section">
          <div className="property-badges">
            {property.isPremium && (
              <span className="badge badge-premium">Premium</span>
            )}
            {property.listingType && (
              <span className={`badge badge-${property.listingType}`}>
                {getLabel(LISTING_TYPE_LABELS[property.listingType])}
              </span>
            )}
            {property.status && property.status !== 'active' && (
              <span className={`badge badge-status badge-${property.status}`}>
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </span>
            )}
          </div>
          <h1>{property.title}</h1>
          <p className="property-address">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {formatAddress(property)}
          </p>
        </div>

        <div className="property-price-section">
          <div className="property-price">
            {formatPrice(property.price, property.listingType, property.currency)}
          </div>
          <div className="property-actions">
            <button
              className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={handleFavoriteToggle}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {isFavorited ? 'Saved' : 'Save'}
            </button>
            <ShareButtons property={property} />
          </div>
        </div>
      </div>

      {/* Property Gallery */}
      <PropertyGallery images={property.images} />

      {/* Main Content */}
      <div className="property-content">
        <div className="property-main">
          {/* Key Features Summary */}
          <div className="key-features">
            {property.bedrooms && (
              <div className="key-feature">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 4v16"></path>
                  <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                  <path d="M2 17h20"></path>
                  <path d="M6 8v9"></path>
                </svg>
                <div>
                  <div className="feature-value">{property.bedrooms}</div>
                  <div className="feature-label">Bedrooms</div>
                </div>
              </div>
            )}

            {property.bathrooms && (
              <div className="key-feature">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l-6 6l6 6"></path>
                  <path d="M3 12h18"></path>
                </svg>
                <div>
                  <div className="feature-value">{property.bathrooms}</div>
                  <div className="feature-label">Bathrooms</div>
                </div>
              </div>
            )}

            {property.area && (
              <div className="key-feature">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18"></rect>
                </svg>
                <div>
                  <div className="feature-value">{property.area}</div>
                  <div className="feature-label">m²</div>
                </div>
              </div>
            )}

            {property.views !== undefined && (
              <div className="key-feature">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <div>
                  <div className="feature-value">{property.views}</div>
                  <div className="feature-label">Views</div>
                </div>
              </div>
            )}
          </div>

          {/* Property Information */}
          <PropertyInfo property={property} />
        </div>

        {/* Sidebar */}
        <aside className="property-sidebar">
          <ContactAgentCard property={property} />
        </aside>
      </div>

      {/* Similar Properties Section (Placeholder for future implementation) */}
      <div className="similar-properties-section">
        <h2>Similar Properties</h2>
        <p className="coming-soon">Coming soon...</p>
      </div>
    </div>
  );
};

export default PropertyDetails;
