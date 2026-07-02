import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders the Futelatosomba app shell', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getAllByText(/futelatosomba/i).length).toBeGreaterThan(0);
  });
});
