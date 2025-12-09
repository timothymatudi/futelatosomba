import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import './PropertyDetailPage.css'; // Will create this later

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <p>Loading property details...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  if (!property) {
    return <p>Property not found.</p>;
  }

  const defaultImage = 'https://via.placeholder.com/800x600?text=No+Image';
  const primaryImage = property.images.find(img => img.isPrimary)?.url || (property.images.length > 0 ? property.images[0].url : defaultImage);

  return (
    <div className="property-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">Back to Search</button>
      <h2>{property.title}</h2>
      <div className="property-images">
        <img src={primaryImage} alt={property.title} className="primary-image" />
        <div className="thumbnail-images">
          {property.images.map((img, index) => (
            <img key={index} src={img.url} alt={img.caption || property.title} className="thumbnail" />
          ))}
        </div>
      </div>

      <div className="property-main-info">
        <p className="price">{property.price} {property.currency} {property.listingType === 'rent' && '/ month'}</p>
        <p className="location">{property.location.address}, {property.location.city}, {property.location.province}, {property.location.country}</p>
        <p>Status: {property.status}</p>
        {property.isPremium && <span className="premium-tag">Premium Listing</span>}
      </div>

      <div className="property-details-grid">
        <div className="detail-item">
          <h4>Bedrooms</h4>
          <p>{property.bedrooms}</p>
        </div>
        <div className="detail-item">
          <h4>Bathrooms</h4>
          <p>{property.bathrooms}</p>
        </div>
        <div className="detail-item">
          <h4>Area</h4>
          <p>{property.area} {property.areaUnit}</p>
        </div>
        <div className="detail-item">
          <h4>Property Type</h4>
          <p>{property.propertyType}</p>
        </div>
        <div className="detail-item">
          <h4>Listing Type</h4>
          <p>{property.listingType}</p>
        </div>
        <div className="detail-item">
          <h4>Year Built</h4>
          <p>{property.yearBuilt}</p>
        </div>
        <div className="detail-item">
          <h4>Available From</h4>
          <p>{new Date(property.availableFrom).toLocaleDateString()}</p>
        </div>
        {property.location.zipCode && (
            <div className="detail-item">
                <h4>Zip Code</h4>
                <p>{property.location.zipCode}</p>
            </div>
        )}
      </div>

      <div className="property-description">
        <h3>Description</h3>
        <p>{property.description}</p>
      </div>

      {property.features && property.features.length > 0 && (
        <div className="property-features">
          <h3>Features</h3>
          <ul>
            {property.features.map((feature, index) => <li key={index}>{feature}</li>)}
          </ul>
        </div>
      )}

      {property.amenities && property.amenities.length > 0 && (
        <div className="property-amenities">
          <h3>Amenities</h3>
          <ul>
            {property.amenities.map((amenity, index) => <li key={index}>{amenity}</li>)}
          </ul>
        </div>
      )}

      {property.owner && (
        <div className="agent-info">
          <h3>Contact Agent</h3>
          <p>Agent: {property.owner.firstName} {property.owner.lastName} ({property.owner.username})</p>
          <p>Email: {property.owner.email}</p>
          <p>Phone: {property.owner.phone}</p>
          {property.owner.agencyName && <p>Agency: {property.owner.agencyName}</p>}
          {property.owner.agencyLogo && <img src={property.owner.agencyLogo} alt="Agency Logo" className="agency-logo" />}
          {/* A contact form would go here */}
          <button className="contact-agent-button">Contact Agent</button>
        </div>
      )}

      {/* Placeholder for map */}
      <div className="property-map">
        <h3>Location Map</h3>
        {/* Integrate a map component here, e.g., OpenStreetMap or Google Maps */}
        <p>Map showing {property.location.address}</p>
      </div>
    </div>
  );
}

export default PropertyDetailPage;
