import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; // Add 'watch' here
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Input from '../common/Input';
import Button from '../common/Button';
import './AuthForms.css';

const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  phone: yup.string().required('Phone number is required'),
  role: yup.string().required('Please select account type'),
  // Agent specific fields, conditional validation
  agencyName: yup.string().when('role', {
    is: 'agent',
    then: (schema) => schema.required('Agency name is required for agents')
  }),
  licenseNumber: yup.string().when('role', {
    is: 'agent',
    then: (schema) => schema.required('License number is required for agents')
  }),
  agencyAddress: yup.string().when('role', {
    is: 'agent',
    then: (schema) => schema.required('Agency address is required for agents')
  }),
  agencyLogo: yup.string().url('Must be a valid URL').optional() // Optional for agents
});

const RegisterForm = ({ onSuccess }) => {
  const { register: registerUser } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch // Destructure watch from useForm
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: 'user'
    }
  });

  const role = watch('role'); // Watch the role field

  const onSubmit = async (data) => {
    setLoading(true);
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    setLoading(false);

    if (result.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <Input
        label={t('fullName')}
        name="name"
        type="text"
        {...register('name')}
        error={errors.name?.message}
        required
        disabled={loading}
      />

      <Input
        label={t('email')}
        name="email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        required
        disabled={loading}
      />

      <Input
        label={t('phone')}
        name="phone"
        type="tel"
        {...register('phone')}
        error={errors.phone?.message}
        placeholder="+243 XX XXX XXXX"
        required
        disabled={loading}
      />

      <div className="input-wrapper">
        <label className="input-label">
          Account Type<span className="input-required">*</span>
        </label>
        <select
          {...register('role')}
          className="input-field"
          disabled={loading}
        >
          <option value="user">Property Seeker</option>
          <option value="agent">Agent/Property Owner</option>
        </select>
        {errors.role && <span className="input-error-message">{errors.role.message}</span>}
      </div>

      {/* Conditionally render agent fields */}
      {role === 'agent' && (
        <>
          <Input
            label={t('agencyName')}
            name="agencyName"
            type="text"
            {...register('agencyName')}
            error={errors.agencyName?.message}
            required
            disabled={loading}
          />
          <Input
            label={t('licenseNumber')}
            name="licenseNumber"
            type="text"
            {...register('licenseNumber')}
            error={errors.licenseNumber?.message}
            required
            disabled={loading}
          />
          <Input
            label={t('agencyAddress')}
            name="agencyAddress"
            type="text"
            {...register('agencyAddress')}
            error={errors.agencyAddress?.message}
            required
            disabled={loading}
          />
          <Input
            label={t('agencyLogo')}
            name="agencyLogo"
            type="url"
            {...register('agencyLogo')}
            error={errors.agencyLogo?.message}
            disabled={loading}
          />
        </>
      )}

      <Input
        label={t('password')}
        name="password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        required
        disabled={loading}
      />

      <Input
        label={t('confirmPassword')}
        name="confirmPassword"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
        required
        disabled={loading}
      />

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {t('register')}
      </Button>
    </form>
  );
};

export default RegisterForm;
