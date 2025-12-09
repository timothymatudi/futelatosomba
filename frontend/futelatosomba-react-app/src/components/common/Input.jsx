import React from 'react';
import './Input.css';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  icon = null,
  rows = 4,
  ...props
}) => {
  const isTextarea = type === 'textarea';
  const InputTag = isTextarea ? 'textarea' : 'input';

  return (
    <div className={`input-wrapper ${error ? 'input-error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}

        <InputTag
          id={name}
          name={name}
          type={isTextarea ? undefined : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={isTextarea ? rows : undefined}
          className={`input-field ${icon ? 'input-with-icon' : ''} ${inputClassName}`.trim()}
          {...props}
        />
      </div>

      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
