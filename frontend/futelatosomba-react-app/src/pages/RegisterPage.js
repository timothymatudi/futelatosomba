import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Auth.css'; // Will create this later

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user', // Default role
    agencyName: '',
    licenseNumber: '',
    agencyAddress: '',
    agencyLogo: ''
  });
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    phone,
    role,
    agencyName,
    licenseNumber,
    agencyAddress,
    agencyLogo
  } = formData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        username,
        email,
        password,
        firstName,
        lastName,
        phone,
        role
      };

      if (role === 'agent') {
        Object.assign(payload, {
          agencyName,
          licenseNumber,
          agencyAddress,
          agencyLogo
        });
      }

      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      console.log('Registration successful:', data.user);
      navigate('/properties'); // Redirect to properties page or dashboard

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" value={firstName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" value={lastName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" value={phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="role">Register as:</label>
          <select id="role" name="role" value={role} onChange={handleRoleChange}>
            <option value="user">User</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {role === 'agent' && (
          <>
            <h3>Agent Details</h3>
            <div className="form-group">
              <label htmlFor="agencyName">Agency Name</label>
              <input type="text" id="agencyName" name="agencyName" value={agencyName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="licenseNumber">License Number</label>
              <input type="text" id="licenseNumber" name="licenseNumber" value={licenseNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="agencyAddress">Agency Address</label>
              <input type="text" id="agencyAddress" name="agencyAddress" value={agencyAddress} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="agencyLogo">Agency Logo URL</label>
              <input type="text" id="agencyLogo" name="agencyLogo" value={agencyLogo} onChange={handleChange} />
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}

export default RegisterPage;
