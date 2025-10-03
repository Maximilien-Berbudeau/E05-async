import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // API call will be implemented later
      console.log('Fetching users...')
      // Simulated data for now
      setUsers([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Microservices Application</h1>
        <p className="subtitle">Frontend Service</p>
      </header>
      
      <main className="app-main">
        <section className="card">
          <h2>User Management</h2>
          <button onClick={fetchUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Users'}
          </button>
          
          {users.length > 0 && (
            <div className="user-list">
              <h3>Users:</h3>
              <ul>
                {users.map(user => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="info">
          <div className="info-card">
            <h3>📊 Status</h3>
            <p>Connected to microservices architecture</p>
          </div>
          <div className="info-card">
            <h3>🔧 Services</h3>
            <p>API Users • API Data • Security</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
