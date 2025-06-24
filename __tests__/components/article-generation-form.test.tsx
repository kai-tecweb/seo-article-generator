import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

// テスト用のシンプルなコンポーネント
const TestComponent = () => {
  return (
    <div data-testid="test-component">
      <h1>テストコンポーネント</h1>
      <button>テストボタン</button>
    </div>
  )
}

describe('コンポーネントテスト基盤', () => {
  it('React Testing Libraryが正常に動作する', () => {
    const { getByTestId, getByRole } = render(<TestComponent />)
    
    expect(getByTestId('test-component')).toBeInTheDocument()
    expect(getByRole('heading')).toBeInTheDocument()
    expect(getByRole('button')).toBeInTheDocument()
  })

  it('テキスト検索が正常に動作する', () => {
    const { getByText } = render(<TestComponent />)
    
    expect(getByText('テストコンポーネント')).toBeInTheDocument()
    expect(getByText('テストボタン')).toBeInTheDocument()
  })

  it('複数の要素を正しく検出する', () => {
    const { container } = render(<TestComponent />)
    
    const heading = container.querySelector('h1')
    const button = container.querySelector('button')
    
    expect(heading).toBeInTheDocument()
    expect(button).toBeInTheDocument()
    expect(heading?.textContent).toBe('テストコンポーネント')
    expect(button?.textContent).toBe('テストボタン')
  })
})
