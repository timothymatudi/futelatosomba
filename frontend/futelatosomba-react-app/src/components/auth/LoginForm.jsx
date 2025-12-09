import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Input from '../common/Input';
import Button from '../common/Button';
import './AuthForms.css';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);

    if (result.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
        label={t('password')}
        name="password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        required
        disabled={loading}
      />

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {t('login')}
      </Button>
    </form>
  );
};

export default LoginForm;
