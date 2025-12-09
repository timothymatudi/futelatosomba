import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard'; // Import PropertyCard

function PropertySearchPage() {
  const [filters, setFilters] = useState({
    listingType: 'sale',
    propertyType: 'any',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'any',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    search: '',
    features: '',
    amenities: '',
    minYearBuilt: '',
    maxYearBuilt: '',
    status: 'active',
    isPremium: ''
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({ ...filters, page, limit: 12 }).toString();
      const response = await fetch(`/api/properties?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]); // Refetch when filters change

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="property-search-page">
      <h2>Advanced Property Search</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <select name="listingType" value={filters.listingType} onChange={handleChange}>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>

        <select name="propertyType" value={filters.propertyType} onChange={handleChange}>
          <option value="any">Any Type</option>
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Commercial">Commercial</option>
          <option value="Land">Land</option>
        </select>

        <input type="text" name="city" placeholder="City" value={filters.city} onChange={handleChange} />
        <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleChange} />
        <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleChange} />
        
        <select name="bedrooms" value={filters.bedrooms} onChange={handleChange}>
          <option value="any">Any Beds</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4+">4+</option>
        </select>

        <input type="number" name="bathrooms" placeholder="Min Baths" value={filters.bathrooms} onChange={handleChange} />
        
        {/* New filters added to backend */}
        <input type="text" name="features" placeholder="Features (comma-separated)" value={filters.features} onChange={handleChange} />
        <input type="text" name="amenities" placeholder="Amenities (comma-separated)" value={filters.amenities} onChange={handleChange} />
        <input type="number" name="minYearBuilt" placeholder="Min Year Built" value={filters.minYearBuilt} onChange={handleChange} />
        <input type="number" name="maxYearBuilt" placeholder="Max Year Built" value={filters.maxYearBuilt} onChange={handleChange} />
        <select name="status" value={filters.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="inactive">Inactive</option>
        </select>
        <label>
            Premium Listings:
            <input type="checkbox" name="isPremium" checked={filters.isPremium === 'true'} onChange={e => setFilters({...filters, isPremium: e.target.checked.toString()})} />
        </label>


        <input type="text" name="search" placeholder="Keywords" value={filters.search} onChange={handleChange} />
        
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading properties...</p>}
      {error && <p className="error">Error: {error}</p>}

      <div className="property-list">
        {properties.length > 0 ? (
          properties.map(property => (
            <PropertyCard key={property._id} property={property} /> // Use PropertyCard component
          ))
        ) : (
          !loading && <p>No properties found matching your criteria.</p>
        )}
      </div>

      <div className="pagination">
        {pagination.hasPrev && (
          <button onClick={() => fetchProperties(pagination.currentPage - 1)}>Previous</button>
        )}
        {pagination.hasNext && (
          <button onClick={() => fetchProperties(pagination.currentPage + 1)}>Next</button>
        )}
        <p>Page {pagination.currentPage} of {pagination.totalPages}</p>
      </div>
    </div>
  );
}

export default PropertySearchPage;
