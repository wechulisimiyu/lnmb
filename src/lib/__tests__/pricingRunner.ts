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

function testPricingLogic() {
  console.log("Testing pricing logic...");
  
  // Test 1: Regular pricing
  const polo = products[0];
  const round = products[1];
  
  const poloRegular = getProductPrice(polo, false);
  const roundRegular = getProductPrice(round, false);
  
  console.log(`Polo regular price: ${poloRegular} (expected: 1500)`);
  console.log(`Round regular price: ${roundRegular} (expected: 1200)`);
  
  // Test 2: Student pricing
  const poloStudent = getProductPrice(polo, true);
  const roundStudent = getProductPrice(round, true);
  
  console.log(`Polo student price: ${poloStudent} (expected: 1000)`);
  console.log(`Round student price: ${roundStudent} (expected: 600)`);
  
  // Test 3: Savings calculation
  const poloSavings = polo.price - polo.studentPrice;
  const roundSavings = round.price - round.studentPrice;
  
  console.log(`Polo savings: ${poloSavings} (expected: 500)`);
  console.log(`Round savings: ${roundSavings} (expected: 600)`);
  
  // Test 4: Maximum savings
  const maxSavings = Math.max(...products.map(p => p.price - p.studentPrice));
  console.log(`Max savings: ${maxSavings} (expected: 600)`);
  
  // Validation
  const allPass = 
    poloRegular === 1500 &&
    roundRegular === 1200 &&
    poloStudent === 1000 &&
    roundStudent === 600 &&
    poloSavings === 500 &&
    roundSavings === 600 &&
    maxSavings === 600;
    
  if (allPass) {
    console.log("✅ All pricing logic tests passed!");
  } else {
    console.log("❌ Some pricing logic tests failed!");
  }
}

testPricingLogic();