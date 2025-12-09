# Admin Panel Backend Documentation

## Overview
This is the complete admin panel backend for Futelatosomba real estate platform. It provides comprehensive administrative controls for managing users, properties, transactions, and donations.

## Features

### Authentication & Authorization
- Admin-only access control
- JWT-based authentication
- Role-based authorization (only `admin` role)
- Automatic logging of all admin actions

### Dashboard Statistics
- Total users, properties, transactions, and donations
- Revenue analytics (total and last 30 days)
- User distribution by role
- Property distribution by status and type
- Top viewed properties
- Recent user and property registrations

### Property Management
- View all properties with filters
- Approve pending properties
- Reject properties with reasons
- Delete properties
- Filter by status (pending, active, sold, rented, inactive)
- Filter by property type
- Search functionality
- Pagination support

### User Management
- View all users with pagination
- Filter by role (user, admin, agent)
- Search by username, email, or name
- View detailed user information
- Update user roles
- Delete/ban users
- View user's properties and transactions
- Property count for each user

### Transaction Management
- View all transactions
- Filter by status and type
- Date range filtering
- Revenue calculations
- Pagination support
- Export-ready data format

### Donation Management
- View all donations
- Filter by status
- Date range filtering
- Total donation amount calculations
- Pagination support
- Donor information tracking

## API Endpoints

### Base URL
```
/api/admin
```

All endpoints require admin authentication via `x-auth-token` header.

---

### 1. Dashboard Statistics
**GET** `/api/admin/stats`

Returns comprehensive dashboard statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "overview": {
      "totalUsers": 150,
      "totalProperties": 320,
      "totalTransactions": 89,
      "totalDonations": 45,
      "activeProperties": 280,
      "pendingProperties": 15,
      "recentUsers": 12,
      "recentProperties": 8
    },
    "revenue": {
      "total": 45678.90,
      "recent30Days": 12345.67,
      "byType": [
        {
          "type": "premium_listing",
          "total": 5000.00,
          "count": 25
        }
      ]
    },
    "donations": {
      "total": 8765.43,
      "count": 45
    },
    "users": {
      "byRole": [
        { "role": "user", "count": 120 },
        { "role": "agent", "count": 28 },
        { "role": "admin", "count": 2 }
      ]
    },
    "properties": {
      "byStatus": [...],
      "byType": [...],
      "topViewed": [...]
    }
  }
}
```

---

### 2. Get All Properties
**GET** `/api/admin/properties`

**Query Parameters:**
- `status` - Filter by status (pending, active, sold, rented, inactive)
- `propertyType` - Filter by type (House, Apartment, Villa, Commercial, Land)
- `search` - Search in title, description, address, city
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - asc or desc (default: desc)

**Example:**
```
GET /api/admin/properties?status=pending&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "properties": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProperties": 95,
    "limit": 20
  }
}
```

---

### 3. Approve Property
**PUT** `/api/admin/properties/:id/approve`

Approves a pending property and sets status to 'active'.

**Response:**
```json
{
  "success": true,
  "msg": "Property approved successfully",
  "property": {...}
}
```

---

### 4. Reject Property
**PUT** `/api/admin/properties/:id/reject`

Rejects a property and sets status to 'inactive'.

**Request Body:**
```json
{
  "reason": "Does not meet quality standards"
}
```

**Response:**
```json
{
  "success": true,
  "msg": "Property rejected successfully",
  "property": {...},
  "reason": "Does not meet quality standards"
}
```

---

### 5. Delete Property
**DELETE** `/api/admin/properties/:id`

Permanently deletes a property.

**Response:**
```json
{
  "success": true,
  "msg": "Property deleted successfully"
}
```

---

### 6. Get All Users
**GET** `/api/admin/users`

**Query Parameters:**
- `role` - Filter by role (user, admin, agent)
- `search` - Search in username, email, firstName, lastName
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - asc or desc (default: desc)

**Example:**
```
GET /api/admin/users?role=agent&page=1
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "agent",
      "propertyCount": 12,
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalUsers": 58,
    "limit": 20
  }
}
```

---

### 7. Get User Details
**GET** `/api/admin/users/:id`

Returns detailed user information including properties and transactions.

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "agent",
    "properties": [...],
    "transactions": [...],
    "propertyCount": 12
  }
}
```

---

### 8. Update User Role
**PUT** `/api/admin/users/:id/role`

Updates a user's role.

**Request Body:**
```json
{
  "role": "agent"
}
```

**Valid roles:** user, admin, agent

**Response:**
```json
{
  "success": true,
  "msg": "User role updated to agent",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "agent"
  }
}
```

**Security:**
- Admins cannot remove their own admin privileges
- All role changes are logged

---

### 9. Delete User
**DELETE** `/api/admin/users/:id`

Deletes a user and all their properties.

**Response:**
```json
{
  "success": true,
  "msg": "User deleted successfully",
  "details": {
    "username": "johndoe",
    "email": "john@example.com",
    "propertiesDeleted": 12
  }
}
```

**Security:**
- Admins cannot delete their own account
- All deletions are logged

---

### 10. Get All Transactions
**GET** `/api/admin/transactions`

**Query Parameters:**
- `status` - Filter by status (pending, processing, succeeded, failed, refunded, canceled)
- `type` - Filter by type (premium_listing, subscription, featured_property, donation)
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - asc or desc (default: desc)

**Example:**
```
GET /api/admin/transactions?status=succeeded&startDate=2025-01-01&endDate=2025-01-31
```

**Response:**
```json
{
  "success": true,
  "transactions": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 4,
    "totalTransactions": 89,
    "limit": 20
  },
  "summary": {
    "totalRevenue": 45678.90
  }
}
```

---

### 11. Get All Donations
**GET** `/api/admin/donations`

**Query Parameters:**
- `status` - Filter by status (pending, succeeded, failed, refunded)
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - asc or desc (default: desc)

**Example:**
```
GET /api/admin/donations?status=succeeded&page=1
```

**Response:**
```json
{
  "success": true,
  "donations": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalDonations": 45,
    "limit": 20
  },
  "summary": {
    "totalAmount": 8765.43
  }
}
```

---

### 12. Get Activity Log
**GET** `/api/admin/activity-log`

Returns recent admin activities.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "activities": [
    {
      "type": "property",
      "action": "status_change",
      "item": "Beautiful Villa in Kinshasa",
      "status": "active",
      "timestamp": "2025-01-20T15:30:00.000Z"
    },
    {
      "type": "user",
      "action": "role_change",
      "item": "johndoe",
      "role": "agent",
      "timestamp": "2025-01-20T14:20:00.000Z"
    }
  ]
}
```

---

### 13. Send Broadcast Message
**POST** `/api/admin/broadcast`

Send a broadcast message to users (placeholder for future email/notification implementation).

**Request Body:**
```json
{
  "message": "Important system announcement",
  "targetRole": "all"
}
```

**Valid targetRole:** all, user, admin, agent

**Response:**
```json
{
  "success": true,
  "msg": "Broadcast sent successfully",
  "recipientCount": 150
}
```

---

## Authentication

All admin endpoints require a valid JWT token with admin role.

**Header:**
```
x-auth-token: <your-jwt-token>
```

**Example Request:**
```javascript
fetch('http://localhost:3000/api/admin/stats', {
  method: 'GET',
  headers: {
    'x-auth-token': 'your-jwt-token-here'
  }
})
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "msg": "Error description",
  "error": "Detailed error message"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (not admin)
- `404` - Not Found
- `500` - Server Error

---

## Logging

All admin actions are logged to the console with the format:
```
Admin action: GET /api/admin/stats by admin_username
```

Specific actions like approvals, rejections, deletions, and role changes include detailed information:
```
Property 507f1f77bcf86cd799439011 approved by admin admin_username
User johndoe role changed from user to agent by admin admin_username
User johndoe (john@example.com) deleted by admin admin_username. Properties deleted: 12
```

---

## Security Features

1. **Role Verification**: Every request verifies the user has admin role
2. **Self-Protection**: Admins cannot delete themselves or remove their own admin role
3. **Action Logging**: All admin actions are logged with user context
4. **Token Validation**: JWT tokens are verified on every request
5. **Database Validation**: User role is checked from database, not just from token

---

## Testing

### Create an Admin User

Use MongoDB or a script to create an admin user:

```javascript
const User = require('./models/User');

const createAdmin = async () => {
  const admin = new User({
    username: 'admin',
    email: 'admin@futelatosomba.com',
    password: 'securePassword123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  });
  await admin.save();
  console.log('Admin user created');
};

createAdmin();
```

### Test Endpoints with cURL

```bash
# Get admin stats
curl -H "x-auth-token: YOUR_TOKEN" http://localhost:3000/api/admin/stats

# Get pending properties
curl -H "x-auth-token: YOUR_TOKEN" "http://localhost:3000/api/admin/properties?status=pending"

# Approve property
curl -X PUT -H "x-auth-token: YOUR_TOKEN" http://localhost:3000/api/admin/properties/PROPERTY_ID/approve

# Update user role
curl -X PUT -H "x-auth-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"agent"}' \
  http://localhost:3000/api/admin/users/USER_ID/role
```

---

## Frontend Integration

### React Example

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Set up axios with auth token
const adminAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'x-auth-token': localStorage.getItem('token')
  }
});

// Get dashboard stats
const getStats = async () => {
  try {
    const response = await adminAPI.get('/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

// Approve property
const approveProperty = async (propertyId) => {
  try {
    const response = await adminAPI.put(`/admin/properties/${propertyId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving property:', error);
  }
};

// Get users with pagination
const getUsers = async (page = 1, role = null) => {
  try {
    const params = { page, limit: 20 };
    if (role) params.role = role;

    const response = await adminAPI.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
```

---

## Production Considerations

### Environment Variables
Ensure these are set in `.env`:
```
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
PORT=3000
```

### Database Indexes
The admin routes use several database indexes for optimal performance:
- User: role, createdAt, username, email
- Property: status, createdAt, owner, propertyType
- Transaction: status, type, createdAt, user
- Donation: status, createdAt

### Rate Limiting
Consider adding rate limiting for admin endpoints:
```javascript
const rateLimit = require('express-rate-limit');

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/admin', adminLimiter);
```

### Monitoring
- Set up error tracking (e.g., Sentry)
- Monitor admin action logs
- Set up alerts for suspicious activities
- Track API performance metrics

---

## Future Enhancements

1. **Email Notifications**
   - Implement actual email sending for broadcasts
   - Notify users when properties are approved/rejected
   - Send reports via email

2. **Advanced Analytics**
   - Revenue trends over time
   - User growth charts
   - Property market analysis
   - Geographic distribution maps

3. **Audit Trail**
   - Dedicated admin action logging table
   - Track who changed what and when
   - Rollback capabilities

4. **Bulk Actions**
   - Bulk approve/reject properties
   - Bulk user management
   - Export data to CSV/Excel

5. **Real-time Updates**
   - WebSocket support for live dashboard
   - Real-time notifications
   - Live user activity tracking

---

## Support

For issues or questions, contact the development team or check the main project documentation.

---

## License

This admin panel is part of the Futelatosomba project and follows the same license.
