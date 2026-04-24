
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecordForm from '../../../frontend/src/components/RecordForm'

describe('RecordForm', () => {
  it('renders add form by default', () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(<RecordForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    expect(screen.getByText('Add New Record')).toBeInTheDocument()
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
  })

  it('renders edit form when isEditing is true', () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(
      <RecordForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEditing={true}
      />
    )

    expect(screen.getByText('Edit Record')).toBeInTheDocument()
    expect(screen.getByText('Update')).toBeInTheDocument()
  })

  it('validates empty amount field', async () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(<RecordForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'Test' },
    })
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Test desc' },
    })

    const submitButton = screen.getByText('Add Record')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument()
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('validates empty category field', async () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(<RecordForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: '100' },
    })
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Test desc' },
    })

    const submitButton = screen.getByText('Add Record')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Category is required')).toBeInTheDocument()
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits valid form data', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
    const mockOnCancel = vi.fn()

    render(<RecordForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    fireEvent.change(screen.getByLabelText(/Type/i), {
      target: { value: 'income' },
    })
    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: '1500.50' },
    })
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'Salary' },
    })
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Monthly salary' },
    })
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2024-01-15' },
    })

    const submitButton = screen.getByText('Add Record')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        type: 'income',
        amount: '1500.50',
        category: 'Salary',
        description: 'Monthly salary',
        date: '2024-01-15',
      })
    })
  })

  it('calls onCancel when cancel button clicked', () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(<RecordForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })
})
