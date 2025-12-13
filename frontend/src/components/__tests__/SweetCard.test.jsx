import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SweetCard from '../SweetCard'
import { sweetsApi } from '../../services/api'

vi.mock('../../services/api', () => ({
  sweetsApi: {
    purchase: vi.fn()
  }
}))

describe('SweetCard', () => {
  const mockSweet = {
    id: 1,
    name: 'Gulab Jamun',
    description: 'Sweet Indian dessert',
    price: 25.50,
    quantity: 10
  }

  const mockOnPurchase = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render sweet data correctly', () => {
    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)

    expect(screen.getByText('Gulab Jamun')).toBeInTheDocument()
    expect(screen.getByText('Sweet Indian dessert')).toBeInTheDocument()
    expect(screen.getByText('$25.50')).toBeInTheDocument()
    expect(screen.getByText('Stock: 10')).toBeInTheDocument()
  })

  it('should disable Purchase button when quantity is zero', () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 }
    render(<SweetCard sweet={outOfStockSweet} onPurchase={mockOnPurchase} />)

    const purchaseButton = screen.getByRole('button', { name: /purchase/i })
    expect(purchaseButton).toBeDisabled()
  })

  it('should disable Purchase button when quantity is undefined', () => {
    const noQuantitySweet = { ...mockSweet }
    delete noQuantitySweet.quantity
    render(<SweetCard sweet={noQuantitySweet} onPurchase={mockOnPurchase} />)

    const purchaseButton = screen.getByRole('button', { name: /purchase/i })
    expect(purchaseButton).toBeDisabled()
  })

  it('should enable Purchase button when quantity is greater than zero', () => {
    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)

    const purchaseButton = screen.getByRole('button', { name: /purchase/i })
    expect(purchaseButton).not.toBeDisabled()
  })

  it('should call purchase API and onPurchase callback on successful purchase', async () => {
    const user = userEvent.setup()
    const mockPurchaseResponse = {
      data: {
        sweetId: 1,
        sweetName: 'Gulab Jamun',
        totalAmount: 25.50,
        quantity: 1
      }
    }

    sweetsApi.purchase.mockResolvedValue(mockPurchaseResponse)

    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)

    const purchaseButton = screen.getByRole('button', { name: /purchase/i })
    await user.click(purchaseButton)

    await waitFor(() => {
      expect(sweetsApi.purchase).toHaveBeenCalledWith(1, 1)
      expect(mockOnPurchase).toHaveBeenCalledWith(mockPurchaseResponse.data)
    })
  })

  it('should update quantity input and use it for purchase', async () => {
    const user = userEvent.setup()
    const mockPurchaseResponse = {
      data: {
        sweetId: 1,
        sweetName: 'Gulab Jamun',
        totalAmount: 51.00,
        quantity: 2
      }
    }

    sweetsApi.purchase.mockResolvedValue(mockPurchaseResponse)

    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)

    const quantityInput = screen.getByRole('spinbutton')
    await user.clear(quantityInput)
    await user.type(quantityInput, '2')

    const purchaseButton = screen.getByRole('button', { name: /purchase/i })
    await user.click(purchaseButton)

    await waitFor(() => {
      expect(sweetsApi.purchase).toHaveBeenCalledWith(1, 2)
    })
  })

  it('should display error message on purchase failure', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Insufficient stock'

    sweetsApi.purchase.mockRejectedValue({
      response: {
        data: {
          message: errorMessage
        }
      }
    })

    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)

    const purchaseButton = screen.getByRole('button', { name: /purchase/i })
    await user.click(purchaseButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    expect(mockOnPurchase).not.toHaveBeenCalled()
  })

  it('should show loading state during purchase', async () => {
    const user = userEvent.setup()
    let resolvePurchase
    const purchasePromise = new Promise((resolve) => {
      resolvePurchase = resolve
    })

    sweetsApi.purchase.mockReturnValue(purchasePromise)

    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)

    const purchaseButton = screen.getByRole('button', { name: /purchase/i })
    await user.click(purchaseButton)

    expect(screen.getByText('Processing...')).toBeInTheDocument()
    expect(purchaseButton).toBeDisabled()

    resolvePurchase({
      data: {
        sweetId: 1,
        sweetName: 'Gulab Jamun',
        totalAmount: 25.50,
        quantity: 1
      }
    })

    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument()
    })
  })
})

