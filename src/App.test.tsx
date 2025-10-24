import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';

describe('App', () => {
  it('renders the data manager tab by default', () => {
    render(
      <MemoryRouter initialEntries={['/data']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('智慧数据管家')).toBeInTheDocument();
  });
});
