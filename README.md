# Personal Dashboard

A modern, customizable personal control dashboard with live data integration and flexible layouts.

## Features

### Core Widgets
- **Weather Widget**: Live weather data with API call limiting (900 calls/day max)
- **Forex & Crypto Widget**: Real-time prices for XAU/USD, BTC/USD, EUR/USD, GBP/JPY and more
- **Calendar Widget**: Google Calendar integration for upcoming events
- **Music Controller**: Spotify/YouTube integration with track metadata
- **System Actions**: One-click lock, sleep, restart, shutdown
- **Password Vault**: Quick access to stored credentials
- **System Monitor**: CPU/GPU/memory/disk/network/battery monitoring
- **Pomodoro Timer**: Productivity timer with notifications
- **Do Not Disturb**: OS notification management
- **Quick Links**: Direct access to Gmail, TradingView, Obsidian, ChatGPT
- **Inspirational Messages**: Rotating uplifting messages

### Layout System
- **Grid Layout**: Traditional responsive grid
- **Stack Layout**: Single-column stacked view
- **Forex Mode**: Trading-focused layout
- **Custom Layout**: Fully draggable and resizable widgets
- **Save/Load Layouts**: Create and manage multiple custom layouts

## Setting Up Live Data

### Weather Data (OpenWeatherMap)

1. Go to [OpenWeatherMap](https://openweathermap.org/api) and create a free account
2. Get your API key from the dashboard
3. Open `src/services/weatherService.ts`
4. Replace `YOUR_OPENWEATHER_API_KEY` with your actual API key

**Important**: The weather service includes API call limiting to stay under 900 calls/day:
- Automatic caching for 15 minutes
- Call tracking with daily reset
- Visual usage monitoring in widget
- Auto-refresh every 20 minutes to conserve calls

### Forex Data (Alpha Vantage)

1. Go to [Alpha Vantage](https://www.alphavantage.co/support/#api-key) and get a free API key
2. Open `src/services/forexService.ts`
3. Replace `YOUR_ALPHAVANTAGE_API_KEY` with your actual API key
4. Implement the API calls in the `fetchForexData` function

### Google Calendar Integration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create credentials (OAuth 2.0 Client ID)
5. Add your domain to authorized origins
6. Update `CalendarWidget.tsx` with your client ID

### Music Integration

#### Spotify
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app and get Client ID/Secret
3. Add redirect URI for your domain
4. Update `MusicWidget.tsx` with credentials

#### YouTube Music
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create API key or OAuth credentials
4. Update `MusicWidget.tsx` with credentials

### System Integration

#### System Actions (Windows/Mac/Linux)
The system actions require platform-specific implementations:

**Windows (PowerShell)**:
- Lock: `rundll32.exe user32.dll,LockWorkStation`
- Sleep: `rundll32.exe powrprof.dll,SetSuspendState 0,1,0`
- Restart: `shutdown /r /t 0`
- Shutdown: `shutdown /s /t 0`

**macOS (AppleScript)**:
- Lock: `pmset displaysleepnow`
- Sleep: `pmset sleepnow`
- Restart: `osascript -e 'tell app "System Events" to restart'`
- Shutdown: `osascript -e 'tell app "System Events" to shut down'`

**Linux**:
- Lock: `gnome-screensaver-command -l` or `xdg-screensaver lock`
- Sleep: `systemctl suspend`
- Restart: `systemctl reboot`
- Shutdown: `systemctl poweroff`

#### System Monitoring
Requires system monitoring APIs or tools:
- **Windows**: WMI queries or PowerShell
- **macOS**: `top`, `iostat`, `system_profiler`
- **Linux**: `/proc/stat`, `/proc/meminfo`, `iostat`

### Alternative Free APIs

- **Fixer.io** - Forex rates (1000 requests/month free)
- **CoinGecko API** - Cryptocurrency prices (unlimited)
- **Finnhub** - Stocks and forex (60 calls/minute free)
- **IEX Cloud** - Financial data (500K messages/month free)
- **NewsAPI** - News headlines (1000 requests/day free)

## Custom Layouts

### Using Custom Layout Mode
1. Click "Custom" in the layout controls
2. Drag widgets by their grip handle (top-right corner)
3. Resize widgets by dragging the bottom-right corner
4. Use Layout Manager to save your arrangement

### Saving Layouts
1. Arrange widgets as desired
2. Click "Layout Manager" button
3. Enter a name and click save
4. Layouts are stored in browser localStorage

### Loading Layouts
1. Open Layout Manager
2. Click the folder icon next to saved layout
3. Layout will be applied immediately

## Development

```bash
npm install
npm run dev
```

### Project Structure
```
src/
├── components/
│   ├── widgets/           # Individual widget components
│   ├── ui/               # Reusable UI components
│   ├── AppLayout.tsx     # Main layout orchestrator
│   ├── DraggableWidget.tsx # Drag/resize wrapper
│   └── LayoutManager.tsx # Layout save/load system
├── services/             # External API integrations
├── contexts/             # React contexts
└── hooks/               # Custom React hooks
```

### Adding New Widgets
1. Create widget component in `src/components/`
2. Add to widgets object in `AppLayout.tsx`
3. Add default layout in `defaultWidgetLayouts`
4. Widget will be available in all layout modes

## Current Status

- ✅ Modern UI with glassmorphism design
- ✅ Modular component architecture
- ✅ 11 functional widgets with mock data
- ✅ 4 layout modes including custom drag/resize
- ✅ Layout save/load system
- ✅ Weather API call limiting (900/day max)
- ✅ Responsive design and dark mode
- ✅ System integration placeholders
- ⏳ Real API integrations (requires API keys)
- ⏳ Platform-specific system actions
- ⏳ Advanced music controls

## Notes

- Without API keys, widgets show realistic mock data
- Custom layouts persist in browser localStorage
- System actions require platform-specific implementation
- Music integration needs OAuth setup for full functionality
- Weather service automatically manages API call limits
- All widgets include manual refresh capabilities