import React, { useState } from 'react';
import { getImageUrl } from '../../utils/formatters';
import './PropertyGallery.css';

const PropertyGallery = ({ images = [] }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, currentImageIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="property-gallery">
        <div className="gallery-main-image">
          <img src="/placeholder-property.jpg" alt="No images available" />
        </div>
      </div>
    );
  }

  const mainImage = images[0];
  const thumbnails = images.slice(1, 5); // Show up to 4 thumbnails

  return (
    <>
      <div className="property-gallery">
        <div className="gallery-main-image" onClick={() => openLightbox(0)}>
          <img
            src={getImageUrl(mainImage.url || mainImage)}
            alt={mainImage.caption || 'Property image 1'}
          />
          <div className="gallery-overlay">
            <div className="gallery-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>View all {images.length} photos</span>
            </div>
          </div>
        </div>

        {thumbnails.length > 0 && (
          <div className="gallery-thumbnails">
            {thumbnails.map((image, index) => (
              <div
                key={index}
                className="gallery-thumbnail"
                onClick={() => openLightbox(index + 1)}
              >
                <img
                  src={getImageUrl(image.url || image)}
                  alt={image.caption || `Property image ${index + 2}`}
                />
                {index === thumbnails.length - 1 && images.length > 5 && (
                  <div className="gallery-more-overlay">
                    <span>+{images.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <button
              className="lightbox-nav lightbox-prev"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className="lightbox-image-container">
              <img
                src={getImageUrl(images[currentImageIndex].url || images[currentImageIndex])}
                alt={images[currentImageIndex].caption || `Property image ${currentImageIndex + 1}`}
              />
              {images[currentImageIndex].caption && (
                <div className="lightbox-caption">{images[currentImageIndex].caption}</div>
              )}
            </div>

            <button
              className="lightbox-nav lightbox-next"
              onClick={nextImage}
              aria-label="Next image"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            <div className="lightbox-counter">
              {currentImageIndex + 1} / {images.length}
            </div>

            <div className="lightbox-thumbnails">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`lightbox-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={getImageUrl(image.url || image)}
                    alt={image.caption || `Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyGallery;
