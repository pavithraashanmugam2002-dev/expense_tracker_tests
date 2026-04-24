
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import FinancialSummary from '../../../frontend/src/components/FinancialSummary'
import * as summaryService from '../../../frontend/src/services/summary.service'

vi.mock('../../../frontend/src/services/summary.service')

describe('FinancialSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays loading state initially', () => {
    vi.spyOn(summaryService, 'getFinancialSummary').mockImplementation(
      () => new Promise(() => {})
    )

    render(<FinancialSummary />)

    expect(screen.getByText('Loading summary...')).toBeInTheDocument()
  })

  it('displays summary data when loaded', async () => {
    vi.spyOn(summaryService, 'getFinancialSummary').mockResolvedValue({
      total_income: 5000.00,
      total_expenses: 2000.00,
      balance: 3000.00,
    })

    render(<FinancialSummary />)

    await waitFor(() => {
      expect(screen.getByText('$5000.00')).toBeInTheDocument()
      expect(screen.getByText('$2000.00')).toBeInTheDocument()
      expect(screen.getByText('$3000.00')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Income')).toBeInTheDocument()
    expect(screen.getByText('Total Expenses')).toBeInTheDocument()
    expect(screen.getByText('Balance')).toBeInTheDocument()
  })

  it('displays error message on fetch failure', async () => {
    vi.spyOn(summaryService, 'getFinancialSummary').mockRejectedValue(
      new Error('Network error')
    )

    render(<FinancialSummary />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load financial summary')).toBeInTheDocument()
    })
  })

  it('displays zero values when no records exist', async () => {
    vi.spyOn(summaryService, 'getFinancialSummary').mockResolvedValue({
      total_income: 0.00,
      total_expenses: 0.00,
      balance: 0.00,
    })

    render(<FinancialSummary />)

    await waitFor(() => {
      expect(screen.getByText('$0.00')).toBeInTheDocument()
    })
  })
})
