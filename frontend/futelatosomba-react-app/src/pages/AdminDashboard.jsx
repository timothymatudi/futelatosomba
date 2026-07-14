import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminDashboard.css';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'properties', label: 'Properties' },
  { id: 'donations', label: 'Donations' },
  { id: 'broadcast', label: 'Broadcast' }
];

const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="admin-loading">Loading stats...</p>;
  if (!stats) return <p className="admin-loading">No stats available.</p>;

  const { overview, revenue, donations } = stats;

  return (
    <div>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-value">{overview.totalUsers}</span>
          <span className="admin-stat-label">Total Users</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{overview.totalProperties}</span>
          <span className="admin-stat-label">Total Properties</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{overview.activeProperties}</span>
          <span className="admin-stat-label">Active Properties</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{overview.pendingProperties}</span>
          <span className="admin-stat-label">Pending Properties</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{overview.recentUsers}</span>
          <span className="admin-stat-label">New Users (7d)</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{overview.recentProperties}</span>
          <span className="admin-stat-label">New Properties (7d)</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">${revenue.total.toFixed(2)}</span>
          <span className="admin-stat-label">Total Revenue</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">${donations.total.toFixed(2)}</span>
          <span className="admin-stat-label">Donations ({donations.count})</span>
        </div>
      </div>

      <div className="admin-overview-lists">
        <div>
          <h3>Users by Role</h3>
          <ul>
            {stats.users.byRole.map((item) => (
              <li key={item.role}>{item.role}: {item.count}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Properties by Status</h3>
          <ul>
            {stats.properties.byStatus.map((item) => (
              <li key={item.status}>{item.status}: {item.count}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Top Viewed Properties</h3>
          <ul>
            {stats.properties.topViewed.map((p) => (
              <li key={p._id}>{p.title} ({p.views} views)</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (roleFilter) params.role = roleFilter;
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      toast.success(`Role updated to ${role}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.username}" and all their properties? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <label>
          Role:
          <select value={roleFilter} onChange={(e) => { setPage(1); setRoleFilter(e.target.value); }}>
            <option value="">All</option>
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="admin-loading">Loading users...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Properties</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}>
                    <option value="user">user</option>
                    <option value="agent">agent</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>{u.propertyCount}</td>
                <td>
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(u)}>Delete</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan="5">No users found.</td></tr>
            )}
          </tbody>
        </table>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

const PropertiesTab = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admin/properties', { params });
      setProperties(res.data.properties);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleApprove = async (property) => {
    try {
      await api.put(`/admin/properties/${property._id}/approve`);
      toast.success('Property approved');
      fetchProperties();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReject = async (property) => {
    const reason = window.prompt(`Reject "${property.title}"? Optionally enter a reason:`);
    if (reason === null) return;
    try {
      await api.put(`/admin/properties/${property._id}/reject`, { reason });
      toast.success('Property rejected');
      fetchProperties();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (property) => {
    if (!window.confirm(`Delete property "${property.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/properties/${property._id}`);
      toast.success('Property deleted');
      fetchProperties();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <label>
          Status:
          <select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="admin-loading">Loading properties...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.owner?.username || '—'}</td>
                <td><span className={`admin-badge admin-badge-${p.status}`}>{p.status}</span></td>
                <td>{p.price != null ? `$${p.price}` : '—'}</td>
                <td>
                  {p.status !== 'active' && (
                    <button className="admin-btn" onClick={() => handleApprove(p)}>Approve</button>
                  )}
                  {p.status !== 'inactive' && (
                    <button className="admin-btn admin-btn-warn" onClick={() => handleReject(p)}>Reject</button>
                  )}
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(p)}>Delete</button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr><td colSpan="5">No properties found.</td></tr>
            )}
          </tbody>
        </table>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

const DonationsTab = () => {
  const [donations, setDonations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/donations', { params: { page, limit: 20 } });
        setDonations(res.data.donations);
        setTotalAmount(res.data.summary?.totalAmount || 0);
        setTotalPages(res.data.pagination.totalPages || 1);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [page]);

  return (
    <div>
      <p className="admin-summary">Total donated (succeeded): <strong>${totalAmount.toFixed(2)}</strong></p>

      {loading ? (
        <p className="admin-loading">Loading donations...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d._id}>
                <td>{d.donor?.userId?.username || d.donor?.name || 'Anonymous'}</td>
                <td>${(d.amount / 100).toFixed(2)}</td>
                <td>{d.status}</td>
                <td>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr><td colSpan="4">No donations found.</td></tr>
            )}
          </tbody>
        </table>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

const BroadcastTab = () => {
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('all');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Message is required');
      return;
    }
    setSending(true);
    try {
      const res = await api.post('/admin/broadcast', { message, targetRole });
      toast.success(`Broadcast sent to ${res.data.recipientCount} users`);
      setMessage('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="admin-broadcast-form" onSubmit={handleSubmit}>
      <label>
        Target audience
        <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
          <option value="all">All users</option>
          <option value="user">Users</option>
          <option value="agent">Agents</option>
          <option value="admin">Admins</option>
        </select>
      </label>
      <label>
        Message
        <textarea
          rows="5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your broadcast message..."
        />
      </label>
      <button type="submit" className="admin-btn" disabled={sending}>
        {sending ? 'Sending...' : 'Send Broadcast'}
      </button>
    </form>
  );
};

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="admin-pagination">
      <button className="admin-btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button className="admin-btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return <p className="admin-loading">Loading...</p>;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <h2>Access denied</h2>
        <p>You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="admin-tab-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'properties' && <PropertiesTab />}
        {activeTab === 'donations' && <DonationsTab />}
        {activeTab === 'broadcast' && <BroadcastTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;
