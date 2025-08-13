import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders the static todo', () => {
  render(<Todo />)
  expect(screen.getByText(/Finish Docker exercise/i)).toBeTruthy()
  expect(screen.getByText(/This Todo is not done/i)).toBeTruthy()
  expect(screen.getByRole('button', { name: /delete/i })).toBeTruthy()
})