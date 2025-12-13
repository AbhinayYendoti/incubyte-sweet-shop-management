import { useState, useEffect } from 'react'
import { sweetsApi } from '../services/api'

function AdminPanel() {
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingSweet, setEditingSweet] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadSweets()
  }, [])

  const loadSweets = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await sweetsApi.getAll()
      setSweets(response.data)
    } catch (err) {
      setError('Failed to load sweets. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return
    }

    try {
      setError('')
      await sweetsApi.delete(id)
      setSuccess('Sweet deleted successfully')
      loadSweets()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete sweet')
    }
  }

  const handleEdit = (sweet) => {
    setEditingSweet({ ...sweet })
    setShowForm(true)
  }

  const handleCancel = () => {
    setEditingSweet(null)
    setShowForm(false)
  }

  const handleSubmit = async (formData) => {
    try {
      setError('')
      setSuccess('')

      if (editingSweet) {
        await sweetsApi.update(editingSweet.id, formData)
        setSuccess('Sweet updated successfully')
      } else {
        await sweetsApi.create(formData)
        setSuccess('Sweet created successfully')
      }

      setShowForm(false)
      setEditingSweet(null)
      loadSweets()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${editingSweet ? 'update' : 'create'} sweet`
      )
    }
  }

  if (loading) {
    return <div style={styles.loading}>Loading sweets...</div>
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Panel</h1>
        <button
          onClick={() => {
            setEditingSweet(null)
            setShowForm(true)
          }}
          style={styles.addButton}
        >
          Add New Sweet
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {showForm && (
        <SweetForm
          sweet={editingSweet}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {sweets.length === 0 ? (
        <div style={styles.empty}>No sweets available.</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet) => (
                <tr key={sweet.id}>
                  <td style={styles.td}>{sweet.id}</td>
                  <td style={styles.td}>{sweet.name}</td>
                  <td style={styles.td}>{sweet.description || '-'}</td>
                  <td style={styles.td}>${sweet.price.toFixed(2)}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEdit(sweet)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sweet.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SweetForm({ sweet, onSubmit, onCancel }) {
  const [name, setName] = useState(sweet?.name || '')
  const [description, setDescription] = useState(sweet?.description || '')
  const [price, setPrice] = useState(sweet?.price || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name,
      description,
      price: parseFloat(price)
    })
  }

  return (
    <div style={styles.formOverlay}>
      <div style={styles.formCard}>
        <h2 style={styles.formTitle}>
          {sweet ? 'Edit Sweet' : 'Add New Sweet'}
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              rows="3"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formActions}>
            <button type="submit" style={styles.submitButton}>
              {sweet ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    margin: 0,
    color: '#333'
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
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
  success: {
    backgroundColor: '#efe',
    color: '#3c3',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
    fontSize: '1.1rem'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f8f9fa',
    fontWeight: '600'
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #ddd'
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '0.5rem'
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  formOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  formCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  formTitle: {
    marginBottom: '1.5rem',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#333',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit'
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  submitButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  }
}

export default AdminPanel

