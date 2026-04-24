
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import DashboardPage from '../../../frontend/src/pages/DashboardPage'
import * as AuthContext from '../../../frontend/src/contexts/AuthContext'
import * as recordsService from '../../../frontend/src/services/records.service'

vi.mock('../../../frontend/src/services/records.service')
vi.mock('../../../frontend/src/services/summary.service', () => ({
  getFinancialSummary: vi.fn().mockResolvedValue({
    total_income: 0,
    total_expenses: 0,
    balance: 0,
  }),
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      userId: 'user123',
      email: 'test@example.com',
      login: vi.fn(),
      logout: vi.fn(),
    })
  })

  it('renders navbar and summary', async () => {
    vi.spyOn(recordsService, 'getAllRecords').mockResolvedValue({
      records: [],
      total: 0,
    })

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('💰 Expense Tracker')).toBeInTheDocument()
      expect(screen.getByText('Financial Summary')).toBeInTheDocument()
    })
  })

  it('displays add record button', async () => {
    vi.spyOn(recordsService, 'getAllRecords').mockResolvedValue({
      records: [],
      total: 0,
    })

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('+ Add New Record')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    vi.spyOn(recordsService, 'getAllRecords').mockImplementation(
      () => new Promise(() => {})
    )

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Loading records...')).toBeInTheDocument()
  })

  it('displays records when loaded', async () => {
    vi.spyOn(recordsService, 'getAllRecords').mockResolvedValue({
      records: [
        {
          id: '1',
          user_id: 'user123',
          type: 'income',
          amount: 1500.00,
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-15',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
        },
      ],
      total: 1,
    })

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Salary')).toBeInTheDocument()
      expect(screen.getByText('$1500.00')).toBeInTheDocument()
    })
  })

  it('displays error message on fetch failure', async () => {
    vi.spyOn(recordsService, 'getAllRecords').mockRejectedValue(
      new Error('Network error')
    )

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Failed to load records/i)).toBeInTheDocument()
    })
  })
})
