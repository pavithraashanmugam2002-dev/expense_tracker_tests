
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RecordList from '../../../frontend/src/components/RecordList'

describe('RecordList', () => {
  it('displays empty state when no records', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <RecordList records={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    expect(
      screen.getByText('No records found. Add your first income or expense!')
    ).toBeInTheDocument()
  })

  it('renders list of records', () => {
    const mockRecords = [
      {
        id: '1',
        type: 'income' as const,
        amount: 1500.00,
        category: 'Salary',
        description: 'Monthly salary',
        date: '2024-01-15',
      },
      {
        id: '2',
        type: 'expense' as const,
        amount: 50.00,
        category: 'Groceries',
        description: 'Weekly shopping',
        date: '2024-01-20',
      },
    ]
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <RecordList
        records={mockRecords}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Salary')).toBeInTheDocument()
    expect(screen.getByText('$1500.00')).toBeInTheDocument()
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })

  it('calls onEdit when edit button clicked', () => {
    const mockRecord = {
      id: '1',
      type: 'income' as const,
      amount: 1500.00,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-15',
    }
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <RecordList
        records={[mockRecord]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockRecord)
  })

  it('shows confirmation before delete', () => {
    const mockRecord = {
      id: '1',
      type: 'income' as const,
      amount: 1500.00,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-15',
    }
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()
    
    global.confirm = vi.fn(() => false)

    render(
      <RecordList
        records={[mockRecord]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(global.confirm).toHaveBeenCalled()
    expect(mockOnDelete).not.toHaveBeenCalled()
  })
})
