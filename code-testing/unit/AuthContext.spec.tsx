
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../../frontend/src/contexts/AuthContext'

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('provides default unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.userId).toBe(null)
    expect(result.current.email).toBe(null)
  })

  it('updates state on login', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.login('user123', 'test@example.com')
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.userId).toBe('user123')
    expect(result.current.email).toBe('test@example.com')
    expect(sessionStorage.getItem('userId')).toBe('user123')
    expect(sessionStorage.getItem('email')).toBe('test@example.com')
  })

  it('clears state on logout', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.login('user123', 'test@example.com')
    })

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.userId).toBe(null)
    expect(result.current.email).toBe(null)
    expect(sessionStorage.getItem('userId')).toBe(null)
    expect(sessionStorage.getItem('email')).toBe(null)
  })

  it('restores state from sessionStorage on mount', () => {
    sessionStorage.setItem('userId', 'stored123')
    sessionStorage.setItem('email', 'stored@example.com')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.userId).toBe('stored123')
    expect(result.current.email).toBe('stored@example.com')
  })
})
