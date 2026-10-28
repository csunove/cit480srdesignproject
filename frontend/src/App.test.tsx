import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
test('shows loading and successful database reachability', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 200, json: async () => ({ status: 'ok', version: '0.1.0', database: { reachable: true, latency_ms: 2 } }) }));
  render(<App />);
  expect(screen.getByText('Checking application services…')).toBeTruthy();
  expect(await screen.findByText('Database: Connected (2 ms)')).toBeTruthy();
});
test('distinguishes database outage from API failure', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 503, json: async () => ({ status: 'degraded', version: '0.1.0', database: { reachable: false, latency_ms: 2 } }) }));
  render(<App />);
  expect(await screen.findByText('Database: Unavailable — service is degraded')).toBeTruthy();
});
test('offers retry after a network error', async () => {
  const fetchMock = vi.fn().mockRejectedValue(new Error('offline'));
  vi.stubGlobal('fetch', fetchMock);
  render(<App />);
  expect(await screen.findByText('The API could not be reached. Please try again.')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Check again' }));
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
