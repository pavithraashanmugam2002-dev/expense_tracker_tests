
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../../../frontend/src/components/Navbar'
import * as AuthContext from '../../../frontend/src/contexts/AuthContext'
import * as authService from '../../../frontend/src/services/auth.service'

vi.mock('../../../frontend/src/services/auth.service')

describe('Navbar', () => {
  it('displays user email', () => {
    const mockLogout = vi.fn()
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      userId: 'user123',
      email: 'test@example.com',
      login: vi.fn(),
      logout: mockLogout,
    })

    render(<Navbar />)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('calls logout on button click', async () => {
    const mockLogout = vi.fn()
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      userId: 'user123',
      email: 'test@example.com',
      login: vi.fn(),
      logout: mockLogout,
    })
    vi.spyOn(authService, 'logoutUser').mockResolvedValue({ message: 'Logout successful' })

    render(<Navbar />)

    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)

    expect(authService.logoutUser).toHaveBeenCalled()
  })

  it('displays app title', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      userId: 'user123',
      email: 'test@example.com',
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(<Navbar />)

    expect(screen.getByText('💰 Expense Tracker')).toBeInTheDocument()
  })
})
