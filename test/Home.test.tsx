import { expect, test, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Home from '../src/pages'

test('Home', () => {
  vi.mock('next/router', () => require('next-router-mock'))

  render(<Home />)
  const main = within(screen.getByRole('main'))
  expect(main.getByText('こんにちは')).toBeDefined()
})
