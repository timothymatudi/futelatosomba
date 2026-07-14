import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatPrice } from '../../utils/formatters';
import './PropertyMap.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Coordinates can arrive as a GeoJSON array ([lng, lat]) or as the model's
// object shape ({ lat, lng }). Normalize both to [lat, lng] for Leaflet.
const getLatLng = (property) => {
  const coords = property?.location?.coordinates;
  if (!coords) return null;
  if (Array.isArray(coords) && coords.length === 2) {
    const [lng, lat] = coords;
    if (typeof lat === 'number' && typeof lng === 'number') return [lat, lng];
    return null;
  }
  if (typeof coords.lat === 'number' && typeof coords.lng === 'number') {
    return [coords.lat, coords.lng];
  }
  return null;
};

const PropertyMap = ({ properties, center, zoom = 12, height = '400px' }) => {
  // Default to Kinshasa coordinates if no center provided
  const defaultCenter = center || [-4.3276, 15.3136];

  // If single property with coordinates, center the map on it
  const singleLatLng = properties && properties.length === 1 ? getLatLng(properties[0]) : null;
  const mapCenter = singleLatLng || defaultCenter;

  return (
    <div className="property-map" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties && properties.map((property) => {
          const latLng = getLatLng(property);
          if (!latLng) return null;

          return (
            <Marker key={property._id} position={latLng}>
              <Popup>
                <div className="map-popup">
                  <h4 className="popup-title">{property.title}</h4>
                  <p className="popup-price">
                    {formatPrice(property.price, property.listingType, property.currency)}
                  </p>
                  <p className="popup-location">
                    {property.location?.address && `${property.location.address}, `}
                    {property.location?.city}
                  </p>
                  <Link to={`/properties/${property._id}`} className="popup-link">
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
