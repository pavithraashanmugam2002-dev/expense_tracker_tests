
import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });

  if (!window.sessionStorage) {
    const mockStorage = {
      getItem: (key) => null,
      setItem: (key, value) => {},
      removeItem: (key) => {},
      clear: () => {},
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: mockStorage,
      writable: true,
    });
  }
}
