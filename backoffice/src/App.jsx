import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('users')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', status: 'active' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user', status: 'inactive' }
  ])
  const [stats] = useState({
    totalUsers: 3,
    activeUsers: 2,
    totalLogs: 1247,
    apiCalls: 8934
  })

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }

  return (
    <div className="admin-app">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>⚙️ Backoffice</h2>
          <p className="subtitle">Admin Panel</p>
        </div>
        
        <nav className="nav-menu">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => handleTabChange('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => handleTabChange('users')}
          >
            👥 Users
          </button>
          <button 
            className={activeTab === 'logs' ? 'active' : ''} 
            onClick={() => handleTabChange('logs')}
          >
            📝 Logs
          </button>
          <button 
            className={activeTab === 'security' ? 'active' : ''} 
            onClick={() => handleTabChange('security')}
          >
            🔒 Security
          </button>
          <button 
            className={activeTab === 'services' ? 'active' : ''} 
            onClick={() => handleTabChange('services')}
          >
            🔧 Services
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="header-actions">
            <span className="status-indicator">🟢 All Systems Operational</span>
          </div>
        </header>

        <div className="content-body">
          {activeTab === 'dashboard' && (
            <div className="dashboard">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-value">{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Users</h3>
                  <p className="stat-value">{stats.activeUsers}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Logs</h3>
                  <p className="stat-value">{stats.totalLogs.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                  <h3>API Calls Today</h3>
                  <p className="stat-value">{stats.apiCalls.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <button className="primary-btn">+ Add User</button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                        <td><span className={`status-badge ${user.status}`}>{user.status}</span></td>
                        <td>
                          <button className="action-btn">Edit</button>
                          <button className="action-btn danger">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="logs-section">
              <div className="info-box">
                <p>📝 Log monitoring system - Connected to MongoDB</p>
                <p className="small">Real-time logs from all microservices</p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-section">
              <div className="info-box">
                <p>🔒 Security & ACL Management</p>
                <p className="small">Manage authentication and access control lists</p>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="services-section">
              <div className="services-grid">
                <div className="service-card">
                  <h4>API Users</h4>
                  <p className="service-status online">🟢 Online</p>
                </div>
                <div className="service-card">
                  <h4>API Data</h4>
                  <p className="service-status online">🟢 Online</p>
                </div>
                <div className="service-card">
                  <h4>Security Service</h4>
                  <p className="service-status online">🟢 Online</p>
                </div>
                <div className="service-card">
                  <h4>Logger</h4>
                  <p className="service-status online">🟢 Online</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
