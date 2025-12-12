import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { IMAGE_UPLOAD } from '../../utils/constants';

import './ImageUploader.css';

const ImageUploader = ({ images = [], onImagesChange, maxImages = IMAGE_UPLOAD.MAX_FILES }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState(images);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!IMAGE_UPLOAD.ACCEPTED_FORMATS.includes(file.type)) {
      toast.error(`${file.name}: Invalid file type.`);
      return false;
    }

    if (file.size > IMAGE_UPLOAD.MAX_SIZE) {
      toast.error(`${file.name}: File too large.`);
      return false;
    }

    return true;
  };

  const handleFiles = (fileList) => {
    const filesArray = Array.from(fileList);

    if (previews.length + filesArray.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const validFiles = filesArray.filter(validateFile);
    if (validFiles.length === 0) return;

    const newPreviews = validFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      url: URL.createObjectURL(file),
      caption: '',
      isPrimary: previews.length === 0 && index === 0
    }));

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    onImagesChange(updatedPreviews);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (id) => {
    const updatedPreviews = previews.filter(p => p.id !== id);
    if (updatedPreviews.length > 0 && !updatedPreviews.some(p => p.isPrimary)) {
      updatedPreviews[0].isPrimary = true;
    }
    setPreviews(updatedPreviews);
    onImagesChange(updatedPreviews);
  };

  const setPrimaryImage = (id) => {
    const updatedPreviews = previews.map(p => ({
      ...p,
      isPrimary: p.id === id
    }));
    setPreviews(updatedPreviews);
    onImagesChange(updatedPreviews);
  };

  const updateCaption = (id, caption) => {
    const updatedPreviews = previews.map(p =>
      p.id === id ? { ...p, caption } : p
    );
    setPreviews(updatedPreviews);
    onImagesChange(updatedPreviews);
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={IMAGE_UPLOAD.ACCEPTED_FORMATS.join(',')}
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        <div className="upload-zone-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>

          <h3>Drag & Drop Images Here</h3>
          <p>or</p>
          <button type="button" className="upload-button" onClick={() => fileInputRef.current?.click()}>
            Choose Files
          </button>

          <div className="upload-info">
            <p>{previews.length} / {maxImages} images</p>
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="image-previews">
          <div className="preview-grid">
            {previews.map((preview, index) => (
              <div key={preview.id} className="preview-item">
                <div className="preview-image-container">
                  <img src={preview.url} alt={preview.caption || `Image ${index + 1}`} />

                  {preview.isPrimary && <div className="primary-badge">Primary</div>}

                  <div className="preview-actions">
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(preview.id)}
                      title="Set as primary"
                    >
                      ★
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(preview.id)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Caption (optional)"
                  value={preview.caption}
                  onChange={(e) => updateCaption(preview.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
