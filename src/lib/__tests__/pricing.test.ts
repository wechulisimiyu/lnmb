import { describe, it, expect } from 'vitest';

// Test pricing logic functionality
interface Product {
  id: string;
  name: string;
  price: number;
  studentPrice: number;
}

const products: Product[] = [
  {
    id: "polo",
    name: "Polo Neck T-Shirt",
    price: 1500,
    studentPrice: 1000,
  },
  {
    id: "round",
    name: "Round Neck T-Shirt",
    price: 1200,
    studentPrice: 600,
  },
];

function getProductPrice(product: Product, isStudent: boolean): number {
  return isStudent ? product.studentPrice : product.price;
}

describe('Student Pricing Logic', () => {
  it('should return regular price for non-students', () => {
    const polo = products[0];
    const round = products[1];
    
    expect(getProductPrice(polo, false)).toBe(1500);
    expect(getProductPrice(round, false)).toBe(1200);
  });

  it('should return student price for students', () => {
    const polo = products[0];
    const round = products[1];
    
    expect(getProductPrice(polo, true)).toBe(1000);
    expect(getProductPrice(round, true)).toBe(600);
  });

  it('should calculate correct savings for students', () => {
    const polo = products[0];
    const round = products[1];
    
    const poloSavings = polo.price - polo.studentPrice;
    const roundSavings = round.price - round.studentPrice;
    
    expect(poloSavings).toBe(500);
    expect(roundSavings).toBe(600);
  });

  it('should validate maximum savings claim', () => {
    const maxSavings = Math.max(...products.map(p => p.price - p.studentPrice));
    expect(maxSavings).toBe(600); // Round neck has the biggest savings
  });
});