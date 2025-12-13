import { useState, useEffect } from 'react'
import { sweetsApi } from '../services/api'
import SweetCard from '../components/SweetCard'

function Dashboard() {
  const [sweets, setSweets] = useState([])
  const [filteredSweets, setFilteredSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadSweets()
  }, [])

  useEffect(() => {
    filterSweets()
  }, [sweets, searchTerm, selectedCategory])

  const loadSweets = async () => {
    try {
      setLoading(true)
      const response = await sweetsApi.getAll()
      setSweets(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load sweets. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterSweets = () => {
    let filtered = sweets

    if (searchTerm) {
      filtered = filtered.filter((sweet) =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(
        (sweet) => sweet.category === selectedCategory
      )
    }

    setFilteredSweets(filtered)
  }

  const handlePurchase = (purchaseData) => {
    loadSweets()
  }

  const categories = ['all', ...new Set(sweets.map((s) => s.category).filter(Boolean))]

  if (loading) {
    return <div style={styles.loading}>Loading sweets...</div>
  }

  return (
    <div>
      <h1 style={styles.title}>Sweet Shop Dashboard</h1>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        {categories.length > 1 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.categorySelect}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {filteredSweets.length === 0 ? (
        <div style={styles.empty}>
          {searchTerm || selectedCategory !== 'all'
            ? 'No sweets found matching your criteria.'
            : 'No sweets available.'}
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredSweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  title: {
    marginBottom: '2rem',
    color: '#333'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#666'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  categorySelect: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minWidth: '150px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
    fontSize: '1.1rem'
  }
}

export default Dashboard

