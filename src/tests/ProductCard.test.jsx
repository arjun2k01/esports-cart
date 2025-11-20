import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// FIX: Correct path from "../ProductCard" to "../components/ProductCard"
import ProductCard from '../components/ProductCard';

const mockProduct = {
  _id: '1',
  name: 'Test Product',
  price: 999,
  image: 'https://example.com/test.jpg',
  category: 'Skins',
  countInStock: 5,
  rating: 4.5
};

describe('ProductCard Component', () => {
  it('should render product name', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should display price correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText(/999/i)).toBeInTheDocument();
  });

  it('should show "In Stock" when available', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText(/in stock/i)).toBeInTheDocument();
  });

  it('should show "Out of Stock" when unavailable', () => {
    const outOfStockProduct = { ...mockProduct, countInStock: 0 };
    
    render(
      <BrowserRouter>
        <ProductCard product={outOfStockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it('should call add to cart on button click', () => {
    const mockAddToCart = vi.fn();
    
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} onAddToCart={mockAddToCart} />
      </BrowserRouter>
    );

    // Note: In your component, the button text is "Add" inside the component, 
    // ensuring the test searches for the correct text or aria-label is good practice.
    // Based on your component code, it renders "Add".
    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });
});