import { useState } from 'react'
import { sweetsApi } from '../services/api'

function SweetCard({ sweet, onPurchase }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePurchase = async () => {
    if (quantity <= 0) return

    setLoading(true)
    setError('')

    try {
      const response = await sweetsApi.purchase(sweet.id, quantity)
      onPurchase(response.data)
      setQuantity(1)
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed')
    } finally {
      setLoading(false)
    }
  }

  const isOutOfStock = !sweet.quantity || sweet.quantity === 0

  return (
    <div style={styles.card}>
      <h3 style={styles.name}>{sweet.name}</h3>
      {sweet.description && (
        <p style={styles.description}>{sweet.description}</p>
      )}
      <div style={styles.details}>
        <span style={styles.price}>${sweet.price.toFixed(2)}</span>
        {sweet.quantity !== undefined && (
          <span style={styles.quantity}>
            Stock: {sweet.quantity}
          </span>
        )}
      </div>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <div style={styles.purchaseSection}>
        <input
          type="number"
          min="1"
          max={sweet.quantity || 1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          disabled={isOutOfStock || loading}
          style={styles.quantityInput}
        />
        <button
          onClick={handlePurchase}
          disabled={isOutOfStock || loading || quantity <= 0}
          style={{
            ...styles.purchaseButton,
            ...(isOutOfStock ? styles.disabledButton : {})
          }}
        >
          {loading ? 'Processing...' : 'Purchase'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  name: {
    margin: 0,
    fontSize: '1.25rem',
    color: '#333'
  },
  description: {
    color: '#666',
    fontSize: '0.9rem',
    margin: 0
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff'
  },
  quantity: {
    color: '#666',
    fontSize: '0.9rem'
  },
  purchaseSection: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  quantityInput: {
    width: '80px',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  purchaseButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  error: {
    color: '#dc3545',
    fontSize: '0.875rem'
  }
}

export default SweetCard

