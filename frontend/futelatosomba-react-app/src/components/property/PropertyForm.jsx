import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageUploader from './ImageUploader';
import { PROPERTY_TYPES, LISTING_TYPES, CITIES, KINSHASA_COMMUNES, AMENITIES } from '../../utils/constants';
import { toast } from 'react-toastify';
import propertyService from '../../services/propertyService';
import './PropertyForm.css';

const PropertyForm = ({ initialData = null, isEdit = false }) => {
  const navigate = useNavigate();
  const { } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    currency: initialData?.currency || 'USD',
    propertyType: initialData?.propertyType || '',
    listingType: initialData?.listingType || 'sale',
    address: initialData?.address || '',
    city: initialData?.city || '',
    commune: initialData?.commune || '',
    province: initialData?.province || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    area: initialData?.area || '',
    yearBuilt: initialData?.yearBuilt || '',
    amenities: initialData?.amenities || [],
    features: initialData?.features || [],
    images: initialData?.images || []
  });

  const totalSteps = 5;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const arrayField = formData[name] || [];
      setFormData({
        ...formData,
        [name]: checked
          ? [...arrayField, value]
          : arrayField.filter(item => item !== value)
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImagesChange = (images) => {
    setFormData({ ...formData, images });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'amenities' && key !== 'features') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append arrays
      if (formData.amenities.length > 0) {
        formDataToSend.append('amenities', JSON.stringify(formData.amenities));
      }
      if (formData.features.length > 0) {
        formDataToSend.append('features', JSON.stringify(formData.features));
      }

      // Append images
      formData.images.forEach((img, index) => {
        if (img.file) {
          formDataToSend.append('images', img.file);
          if (img.caption) formDataToSend.append(`imageCaption_${index}`, img.caption);
          if (img.isPrimary) formDataToSend.append('primaryImageIndex', index);
        }
      });

      if (isEdit && initialData?._id) {
        await propertyService.updateProperty(initialData._id, formDataToSend);
        toast.success('Property updated successfully!');
      } else {
        await propertyService.createProperty(formDataToSend);
        toast.success('Property created successfully!');
      }

      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4, 5].map(step => (
        <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 && 'Basic Info'}
            {step === 2 && 'Location'}
            {step === 3 && 'Details'}
            {step === 4 && 'Features'}
            {step === 5 && 'Images'}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="property-form-container">
      <h2>{isEdit ? 'Edit Property' : 'Add New Property'}</h2>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="property-form">

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="form-step">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Beautiful 3 Bedroom House in Gombe"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Describe your property..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select name="currency" value={formData.currency} onChange={handleChange}>
                  <option value="USD">USD ($)</option>
                  <option value="CDF">CDF (FC)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Property Type *</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                  <option value="">Select type</option>
                  {Object.values(PROPERTY_TYPES).map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Listing Type *</label>
                <select name="listingType" value={formData.listingType} onChange={handleChange} required>
                  {Object.values(LISTING_TYPES).map(type => (
                    <option key={type} value={type}>{type === 'sale' ? 'For Sale' : 'For Rent'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="form-step">
            <h3>Location</h3>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Street address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <select name="city" value={formData.city} onChange={handleChange} required>
                  <option value="">Select city</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {formData.city === 'Kinshasa' && (
                <div className="form-group">
                  <label>Commune</label>
                  <select name="commune" value={formData.commune} onChange={handleChange}>
                    <option value="">Select commune</option>
                    {KINSHASA_COMMUNES.map(commune => (
                      <option key={commune} value={commune}>{commune}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Province</label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder="Province"
              />
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {currentStep === 3 && (
          <div className="form-step">
            <h3>Property Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Area (m²)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Year Built</label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Features & Amenities */}
        {currentStep === 4 && (
          <div className="form-step">
            <h3>Features & Amenities</h3>

            <div className="form-group">
              <label>Amenities</label>
              <div className="checkbox-grid">
                {AMENITIES.map(amenity => (
                  <label key={amenity.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity.value}
                      checked={formData.amenities.includes(amenity.value)}
                      onChange={handleChange}
                    />
                    <span>{amenity.label.en}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Images */}
        {currentStep === 5 && (
          <div className="form-step">
            <h3>Property Images</h3>
            <ImageUploader images={formData.images} onImagesChange={handleImagesChange} />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              Previous
            </button>
          )}

          {currentStep < totalSteps ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Property' : 'Create Property')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
