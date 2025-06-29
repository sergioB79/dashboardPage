import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Settings, RefreshCw } from 'lucide-react';
import { fetchForexData } from '@/services/forexService';

interface ForexPair {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  visible: boolean;
}

const ForexWidget: React.FC = () => {
  const [pairs, setPairs] = useState<ForexPair[]>([
    { symbol: 'XAU/USD', price: 2045.50, change: 12.30, changePercent: 0.60, visible: true },
    { symbol: 'BTC/USD', price: 43250.00, change: -850.00, changePercent: -1.93, visible: true },
    { symbol: 'EUR/USD', price: 1.0875, change: 0.0025, changePercent: 0.23, visible: true },
    { symbol: 'GBP/JPY', price: 185.45, change: -0.75, changePercent: -0.40, visible: true },
    { symbol: 'USD/JPY', price: 149.85, change: 0.35, changePercent: 0.23, visible: false },
    { symbol: 'AUD/USD', price: 0.6745, change: -0.0015, changePercent: -0.22, visible: false }
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadForexData = async () => {
    setLoading(true);
    try {
      const symbols = pairs.map(pair => pair.symbol);
      const data = await fetchForexData(symbols);
      
      setPairs(prev => prev.map(pair => {
        const newData = data[pair.symbol];
        if (newData) {
          return {
            ...pair,
            price: newData.price,
            change: newData.change,
            changePercent: newData.changePercent
          };
        }
        return pair;
      }));
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load forex data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForexData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadForexData, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const togglePairVisibility = (symbol: string) => {
    setPairs(prev => prev.map(pair => 
      pair.symbol === symbol ? { ...pair, visible: !pair.visible } : pair
    ));
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes('JPY')) return price.toFixed(2);
    if (symbol.includes('BTC')) return price.toLocaleString();
    return price.toFixed(4);
  };

  const visiblePairs = pairs.filter(pair => pair.visible);

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-green-900 dark:text-green-100">
            Forex & Crypto
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadForexData}
              disabled={loading}
              className="text-green-700 dark:text-green-300"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-green-700 dark:text-green-300"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-green-600 dark:text-green-400">
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {showSettings && (
          <div className="mb-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <h4 className="text-sm font-medium mb-2 text-green-900 dark:text-green-100">Select Assets:</h4>
            <div className="grid grid-cols-2 gap-2">
              {pairs.map((pair) => (
                <label key={pair.symbol} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={pair.visible}
                    onChange={() => togglePairVisibility(pair.symbol)}
                    className="rounded"
                  />
                  <span className="text-green-800 dark:text-green-200">{pair.symbol}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        {visiblePairs.map((pair) => (
          <div key={pair.symbol} className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded-lg">
            <div>
              <div className="font-semibold text-green-900 dark:text-green-100">
                {pair.symbol}
              </div>
              <div className="text-lg font-bold text-green-800 dark:text-green-200">
                {formatPrice(pair.price, pair.symbol)}
              </div>
            </div>
            <div className="text-right">
              <Badge variant={pair.change >= 0 ? 'default' : 'destructive'} className="mb-1">
                {pair.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {pair.changePercent.toFixed(2)}%
              </Badge>
              <div className={`text-sm ${pair.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ForexWidget;