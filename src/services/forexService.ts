// Forex service using Alpha Vantage API
// You'll need to get a free API key from https://www.alphavantage.co/support/#api-key

interface ForexPair {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  visible: boolean;
}

const API_KEY = 'HJ6SOKKPWFR9KSPW'; // Replace with your actual API key
const BASE_URL = 'https://www.alphavantage.co/query';

// Mock data for when API key is not set
const mockData: Record<string, { price: number; change: number; changePercent: number }> = {
  'XAU/USD': { price: 2045.50, change: 12.30, changePercent: 0.60 },
  'BTC/USD': { price: 43250.00, change: -850.00, changePercent: -1.93 },
  'EUR/USD': { price: 1.0875, change: 0.0025, changePercent: 0.23 },
  'GBP/JPY': { price: 185.45, change: -0.75, changePercent: -0.40 },
  'USD/JPY': { price: 149.85, change: 0.35, changePercent: 0.23 },
  'AUD/USD': { price: 0.6745, change: -0.0015, changePercent: -0.22 }
};

export const fetchForexData = async (symbols: string[]): Promise<Record<string, any>> => {
  try {
    if (API_KEY === 'YOUR_ALPHAVANTAGE_API_KEY') {
      // Return mock data with slight variations
      const result: Record<string, any> = {};
      symbols.forEach(symbol => {
        const mock = mockData[symbol];
        if (mock) {
          const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
          result[symbol] = {
            price: mock.price * (1 + variation),
            change: mock.change * (1 + variation * 0.5),
            changePercent: mock.changePercent * (1 + variation * 0.5)
          };
        }
      });
      return result;
    }

    // Real API implementation would go here
    // For now, return mock data
    const result: Record<string, any> = {};
    symbols.forEach(symbol => {
      const mock = mockData[symbol];
      if (mock) {
        result[symbol] = mock;
      }
    });
    return result;
  } catch (error) {
    console.error('Forex fetch error:', error);
    return {};
  }
};