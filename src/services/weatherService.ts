// Weather service with API call limiting to stay under 900 calls per day
// You'll need to get a free API key from https://openweathermap.org/api

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  description?: string;
}

interface CachedWeatherData extends WeatherData {
  timestamp: number;
  callCount: number;
  lastResetDate: string;
}

const API_KEY = '28cac9c820f81d8adcf8cd9774ca6182'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const CACHE_KEY = 'weather_cache_nazare';
const CALL_COUNT_KEY = 'weather_api_calls';
const MAX_CALLS_PER_DAY = 900;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Get today's date as string
const getTodayString = (): string => {
  return new Date().toDateString();
};

// Get or initialize call tracking
const getCallTracking = (): { count: number; date: string } => {
  const stored = localStorage.getItem(CALL_COUNT_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Reset count if it's a new day
    if (parsed.date !== getTodayString()) {
      return { count: 0, date: getTodayString() };
    }
    return parsed;
  }
  return { count: 0, date: getTodayString() };
};

// Update call count
const updateCallCount = (): void => {
  const tracking = getCallTracking();
  tracking.count += 1;
  localStorage.setItem(CALL_COUNT_KEY, JSON.stringify(tracking));
};

// Check if we can make an API call
const canMakeApiCall = (): boolean => {
  const tracking = getCallTracking();
  return tracking.count < MAX_CALLS_PER_DAY;
};

// Get cached data
const getCachedData = (): CachedWeatherData | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const data = JSON.parse(cached) as CachedWeatherData;
    // Check if cache is still valid
    if (Date.now() - data.timestamp < CACHE_DURATION) {
      return data;
    }
  }
  return null;
};

// Cache weather data
const cacheWeatherData = (data: WeatherData): void => {
  const tracking = getCallTracking();
  const cachedData: CachedWeatherData = {
    ...data,
    timestamp: Date.now(),
    callCount: tracking.count,
    lastResetDate: tracking.date
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
};

export const fetchWeatherData = async (city: string): Promise<WeatherData & { fromCache?: boolean; callsRemaining?: number }> => {
  try {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      const tracking = getCallTracking();
      return {
        temperature: cachedData.temperature,
        condition: cachedData.condition,
        humidity: cachedData.humidity,
        description: cachedData.description,
        fromCache: true,
        callsRemaining: MAX_CALLS_PER_DAY - tracking.count
      };
    }

    // Check if we can make API call
    if (!canMakeApiCall()) {
      console.warn('Daily API limit reached, using fallback data');
      return {
        temperature: 18,
        condition: 'Data Unavailable',
        humidity: 65,
        description: 'Daily API limit reached',
        fromCache: false,
        callsRemaining: 0
      };
    }

    if (API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
      // Return mock data if API key not set
      const mockData = {
        temperature: Math.floor(Math.random() * 10) + 15,
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
        humidity: Math.floor(Math.random() * 30) + 50
      };
      cacheWeatherData(mockData);
      return { ...mockData, fromCache: false, callsRemaining: MAX_CALLS_PER_DAY };
    }

    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    // Update call count only after successful API call
    updateCallCount();
    
    const data = await response.json();
    
    const weatherData = {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      description: data.weather[0].description
    };

    // Cache the data
    cacheWeatherData(weatherData);
    
    const tracking = getCallTracking();
    return {
      ...weatherData,
      fromCache: false,
      callsRemaining: MAX_CALLS_PER_DAY - tracking.count
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    // Return fallback data
    return {
      temperature: 18,
      condition: 'Error',
      humidity: 65,
      description: 'Failed to fetch weather',
      fromCache: false,
      callsRemaining: MAX_CALLS_PER_DAY - getCallTracking().count
    };
  }
};

// Export function to get current API usage stats
export const getApiUsageStats = () => {
  const tracking = getCallTracking();
  return {
    callsUsed: tracking.count,
    callsRemaining: MAX_CALLS_PER_DAY - tracking.count,
    resetDate: tracking.date,
    maxCalls: MAX_CALLS_PER_DAY
  };
};