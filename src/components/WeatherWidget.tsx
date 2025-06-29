import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchWeatherData, getApiUsageStats } from '@/services/weatherService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  description?: string;
  fromCache?: boolean;
  callsRemaining?: number;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 18,
    condition: 'Loading...',
    humidity: 65
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [apiStats, setApiStats] = useState(getApiUsageStats());

  const loadWeatherData = async () => {
    setLoading(true);
    try {
      const data = await fetchWeatherData('Nazaré,PT');
      setWeather(data);
      setLastUpdated(new Date());
      setApiStats(getApiUsageStats());
    } catch (error) {
      console.error('Failed to load weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
    // Auto-refresh every 20 minutes (increased from 10 to save API calls)
    const interval = setInterval(loadWeatherData, 20 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'Clear':
      case 'Sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'Rain':
      case 'Rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'Error':
      case 'Data Unavailable':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    if (apiStats.callsRemaining < 50) return 'bg-red-500';
    if (apiStats.callsRemaining < 200) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Nazaré Weather
            </CardTitle>
            {weather.fromCache && (
              <Badge variant="secondary" className="text-xs">
                Cached
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadWeatherData}
            disabled={loading}
            className="text-blue-700 dark:text-blue-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {weather.temperature}°C
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              {weather.condition}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Humidity: {weather.humidity}%
            </div>
            <div className="text-xs text-blue-500 dark:text-blue-500 mt-1">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <div className="ml-4">
            {getWeatherIcon()}
          </div>
        </div>
        
        {/* API Usage Stats */}
        <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-600 dark:text-blue-400">
              API Calls Today: {apiStats.callsUsed}/900
            </span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
              <span className="text-blue-500 dark:text-blue-500">
                {apiStats.callsRemaining} left
              </span>
            </div>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1 mt-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(apiStats.callsUsed / 900) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;