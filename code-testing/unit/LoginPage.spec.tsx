
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../../../frontend/src/pages/LoginPage'
import * as AuthContext from '../../../frontend/src/contexts/AuthContext'
import * as authService from '../../../frontend/src/services/auth.service'

vi.mock('../../../frontend/src/services/auth.service')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      userId: null,
      email: null,
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    expect(screen.getByText('💰 Expense Tracker')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('displays demo credentials', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      userId: null,
      email: null,
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Demo Credentials:')).toBeInTheDocument()
    expect(screen.getByText('user1@example.com / password123')).toBeInTheDocument()
  })

  it('submits form with valid credentials', async () => {
    const mockLogin = vi.fn()
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      userId: null,
      email: null,
      login: mockLogin,
      logout: vi.fn(),
    })
    vi.spyOn(authService, 'loginUser').mockResolvedValue({
      user_id: 'user123',
      email: 'test@example.com',
      message: 'Login successful',
    })

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    })

    const submitButton = screen.getByText('Sign In')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      )
      expect(mockLogin).toHaveBeenCalledWith('user123', 'test@example.com')
    })
  })

  it('displays error on login failure', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      userId: null,
      email: null,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.spyOn(authService, 'loginUser').mockRejectedValue({
      response: { data: { detail: 'Invalid credentials' } },
    })

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    })

    const submitButton = screen.getByText('Sign In')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})
