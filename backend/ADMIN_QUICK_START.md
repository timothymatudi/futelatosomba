# Admin Panel Quick Start Guide

This guide will help you quickly set up and start using the admin panel.

## Prerequisites

- Node.js installed
- MongoDB running
- Backend server configured

## Step 1: Create an Admin User

### Option A: Create New Admin User

```bash
cd /data/data/com.termux/files/home/futelatosomba/backend

# Create admin with default credentials
node scripts/createAdmin.js

# Or create with custom credentials
node scripts/createAdmin.js myusername admin@example.com SecurePass123 John Doe
```

**Default Credentials:**
- Username: `admin`
- Email: `admin@futelatosomba.com`
- Password: `Admin@123`

### Option B: Promote Existing User

```bash
# Promote by username
node scripts/promoteToAdmin.js johndoe

# Or promote by email
node scripts/promoteToAdmin.js john@example.com
```

## Step 2: Login to Get Auth Token

Send a POST request to login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@futelatosomba.com",
    "password": "Admin@123"
  }'
```

Response will include a JWT token:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@futelatosomba.com",
    "role": "admin"
  }
}
```

Save this token - you'll need it for all admin requests!

## Step 3: Test Admin Access

### Test All Endpoints (Automated)

```bash
# Replace YOUR_TOKEN with your actual JWT token
node scripts/testAdminEndpoints.js YOUR_TOKEN
```

### Test Individual Endpoints (Manual)

#### Get Dashboard Statistics
```bash
curl -H "x-auth-token: YOUR_TOKEN" \
  http://localhost:3000/api/admin/stats
```

#### Get Pending Properties
```bash
curl -H "x-auth-token: YOUR_TOKEN" \
  "http://localhost:3000/api/admin/properties?status=pending"
```

#### Get All Users
```bash
curl -H "x-auth-token: YOUR_TOKEN" \
  "http://localhost:3000/api/admin/users?page=1&limit=20"
```

## Step 4: Common Admin Tasks

### Approve a Property

```bash
curl -X PUT \
  -H "x-auth-token: YOUR_TOKEN" \
  http://localhost:3000/api/admin/properties/PROPERTY_ID/approve
```

### Reject a Property

```bash
curl -X PUT \
  -H "x-auth-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Does not meet quality standards"}' \
  http://localhost:3000/api/admin/properties/PROPERTY_ID/reject
```

### Change User Role

```bash
curl -X PUT \
  -H "x-auth-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"agent"}' \
  http://localhost:3000/api/admin/users/USER_ID/role
```

### Delete User

```bash
curl -X DELETE \
  -H "x-auth-token: YOUR_TOKEN" \
  http://localhost:3000/api/admin/users/USER_ID
```

## Step 5: Using with Frontend (React)

### Setup API Client

```javascript
// src/utils/adminAPI.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const adminAPI = axios.create({
  baseURL: API_URL,
});

// Add auth token to all requests
adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Handle errors
adminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      alert('Access denied. Admin privileges required.');
    }
    return Promise.reject(error);
  }
);

export default adminAPI;
```

### Get Dashboard Stats

```javascript
// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import adminAPI from '../utils/adminAPI';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.get('/admin/stats');
        setStats(response.data.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.overview.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Properties</h3>
          <p>{stats.overview.totalProperties}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Properties</h3>
          <p>{stats.overview.pendingProperties}</p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${stats.revenue.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
```

### Manage Properties

```javascript
// src/pages/AdminProperties.jsx
import { useState, useEffect } from 'react';
import adminAPI from '../utils/adminAPI';

function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProperties();
  }, [filter, page]);

  const fetchProperties = async () => {
    try {
      const response = await adminAPI.get('/admin/properties', {
        params: { status: filter, page, limit: 20 }
      });
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      await adminAPI.put(`/admin/properties/${propertyId}/approve`);
      alert('Property approved successfully');
      fetchProperties(); // Refresh list
    } catch (error) {
      console.error('Error approving property:', error);
      alert('Failed to approve property');
    }
  };

  const handleReject = async (propertyId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await adminAPI.put(`/admin/properties/${propertyId}/reject`, { reason });
      alert('Property rejected successfully');
      fetchProperties(); // Refresh list
    } catch (error) {
      console.error('Error rejecting property:', error);
      alert('Failed to reject property');
    }
  };

  return (
    <div className="admin-properties">
      <h1>Property Management</h1>

      <div className="filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      <div className="properties-list">
        {properties.map(property => (
          <div key={property._id} className="property-card">
            <h3>{property.title}</h3>
            <p>{property.location.address}</p>
            <p>${property.price.toLocaleString()}</p>
            <p>Status: {property.status}</p>

            {property.status === 'pending' && (
              <div className="actions">
                <button onClick={() => handleApprove(property._id)}>
                  Approve
                </button>
                <button onClick={() => handleReject(property._id)}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProperties;
```

## Security Best Practices

### 1. Change Default Password
```bash
# After first login, change the default password
curl -X PUT \
  -H "x-auth-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"Admin@123","newPassword":"YourNewSecurePassword123!"}' \
  http://localhost:3000/api/users/change-password
```

### 2. Use Environment Variables
Never hardcode tokens in your frontend:

```javascript
// .env.local
REACT_APP_API_URL=http://localhost:3000/api

// Use in code
const API_URL = process.env.REACT_APP_API_URL;
```

### 3. Protect Admin Routes
```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}

// Usage in App.jsx
<Route
  path="/admin/*"
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

## Troubleshooting

### Issue: "Authorization denied"
**Solution:** Make sure you're including the auth token in the header:
```javascript
headers: { 'x-auth-token': 'your-token-here' }
```

### Issue: "Access denied. Admin privileges required"
**Solution:**
1. Verify user has admin role: Check in MongoDB or use promoteToAdmin.js
2. Make sure you're logged in with the admin account
3. Token might be expired - login again to get a new token

### Issue: "User not found"
**Solution:**
1. Create admin user using `node scripts/createAdmin.js`
2. Or promote existing user using `node scripts/promoteToAdmin.js`

### Issue: "Cannot connect to server"
**Solution:**
1. Make sure backend server is running: `npm start`
2. Check if MongoDB is running
3. Verify PORT in .env file matches your requests

## Next Steps

1. Read the full documentation: `ADMIN_PANEL_README.md`
2. Explore all available endpoints
3. Build a frontend admin dashboard
4. Set up monitoring and logging
5. Configure rate limiting for production

## Support

For detailed API documentation, see `ADMIN_PANEL_README.md`

For issues or questions, check the main project documentation.
