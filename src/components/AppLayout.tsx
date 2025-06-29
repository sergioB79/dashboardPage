import React, { useState, useCallback, useRef } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSecretSequence } from '@/hooks/useSecretSequence';
import { useMasterPassword } from '@/hooks/useMasterPassword';
import WeatherWidget from './WeatherWidget';
import ForexWidget from './ForexWidget';
import InspirationWidget from './InspirationWidget';
import QuickLinksWidget from './QuickLinksWidget';
import CalendarWidget from './CalendarWidget';
import MusicWidget from './MusicWidget';
import SystemActionsWidget from './SystemActionsWidget';
import PasswordVaultWidget from './PasswordVaultWidget';
import SystemMonitorWidget from './SystemMonitorWidget';
import PomodoroWidget from './PomodoroWidget';
import DoNotDisturbWidget from './DoNotDisturbWidget';
import LayoutControls, { LayoutMode } from './LayoutControls';
import DraggableWidget from './DraggableWidget';

interface WidgetLayout {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}

const defaultWidgetLayouts: Record<string, WidgetLayout> = {
  weather: { id: 'weather', position: { x: 20, y: 120 }, size: { width: 300, height: 200 }, visible: true },
  forex: { id: 'forex', position: { x: 340, y: 120 }, size: { width: 400, height: 300 }, visible: true },
  calendar: { id: 'calendar', position: { x: 760, y: 120 }, size: { width: 300, height: 250 }, visible: true },
  music: { id: 'music', position: { x: 20, y: 340 }, size: { width: 300, height: 180 }, visible: true },
  system: { id: 'system', position: { x: 340, y: 440 }, size: { width: 250, height: 160 }, visible: true },
  password: { id: 'password', position: { x: 610, y: 440 }, size: { width: 300, height: 200 }, visible: true },
  monitor: { id: 'monitor', position: { x: 930, y: 440 }, size: { width: 280, height: 220 }, visible: true },
  pomodoro: { id: 'pomodoro', position: { x: 20, y: 540 }, size: { width: 250, height: 180 }, visible: true },
  dnd: { id: 'dnd', position: { x: 290, y: 620 }, size: { width: 200, height: 120 }, visible: true },
  links: { id: 'links', position: { x: 510, y: 660 }, size: { width: 300, height: 150 }, visible: true },
  inspiration: { id: 'inspiration', position: { x: 20, y: 740 }, size: { width: 600, height: 120 }, visible: true }
};

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('multi-tile');
  const [customLayout, setCustomLayout] = useState<Record<string, WidgetLayout>>(defaultWidgetLayouts);
  
  const { addToSequence, isComplete } = useSecretSequence();
  const { insertPassword } = useMasterPassword();

  // Handle secret sequence completion
  React.useEffect(() => {
    if (isComplete) {
      console.log('Secret sequence completed!');
      
      // Try multiple selectors to find password input
      const selectors = [
        'input[type="password"]',
        'input[placeholder*="password"]',
        'input[placeholder*="Password"]',
        'input[placeholder*="Master password"]'
      ];
      
      let passwordInput: HTMLInputElement | null = null;
      
      for (const selector of selectors) {
        passwordInput = document.querySelector(selector) as HTMLInputElement;
        if (passwordInput) {
          console.log('Found password input with selector:', selector);
          break;
        }
      }
      
      if (passwordInput) {
        insertPassword(passwordInput);
      } else {
        console.log('No password input found');
      }
    }
  }, [isComplete, insertPassword]);

  const handlePositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    setCustomLayout(prev => ({
      ...prev,
      [id]: { ...prev[id], position }
    }));
  }, []);

  const handleSizeChange = useCallback((id: string, size: { width: number; height: number }) => {
    setCustomLayout(prev => ({
      ...prev,
      [id]: { ...prev[id], size }
    }));
  }, []);

  const handleCustomLayoutLoad = useCallback((layout: Record<string, WidgetLayout>) => {
    setCustomLayout(layout);
  }, []);

  const handleCustomLayoutSave = useCallback((name: string) => {
    // Layout saving is handled in LayoutManager
  }, []);

  const widgets = {
    weather: <WeatherWidget />,
    forex: <ForexWidget />,
    calendar: <CalendarWidget />,
    music: <MusicWidget />,
    system: <SystemActionsWidget />,
    password: <PasswordVaultWidget />,
    monitor: <SystemMonitorWidget />,
    pomodoro: <PomodoroWidget />,
    dnd: <DoNotDisturbWidget />,
    links: <QuickLinksWidget />,
    inspiration: <InspirationWidget />
  };

  const renderCustomLayout = () => (
    <div className="relative min-h-screen">
      {Object.entries(customLayout)
        .filter(([_, layout]) => layout.visible)
        .map(([widgetId, layout]) => (
          <DraggableWidget
            key={widgetId}
            id={widgetId}
            position={layout.position}
            size={layout.size}
            onPositionChange={handlePositionChange}
            onSizeChange={handleSizeChange}
          >
            {widgets[widgetId as keyof typeof widgets]}
          </DraggableWidget>
        ))
      }
    </div>
  );

  const renderMultiTileLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <WeatherWidget />
      <ForexWidget />
      <CalendarWidget />
      <MusicWidget />
      <SystemActionsWidget />
      <PasswordVaultWidget />
      <SystemMonitorWidget />
      <PomodoroWidget />
      <DoNotDisturbWidget />
      <QuickLinksWidget />
      <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
        <InspirationWidget />
      </div>
    </div>
  );

  const renderSinglePanelLayout = () => (
    <div className="max-w-2xl mx-auto">
      <div className="grid gap-4">
        <WeatherWidget />
        <ForexWidget />
        <CalendarWidget />
        <MusicWidget />
        <SystemMonitorWidget />
        <PomodoroWidget />
      </div>
    </div>
  );

  const renderForexModeLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <ForexWidget />
      </div>
      <SystemMonitorWidget />
      <WeatherWidget />
      <PomodoroWidget />
      <div className="lg:col-span-2 xl:col-span-3">
        <InspirationWidget />
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (layoutMode) {
      case 'custom':
        return renderCustomLayout();
      case 'single-panel':
        return renderSinglePanelLayout();
      case 'forex-mode':
        return renderForexModeLayout();
      default:
        return renderMultiTileLayout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Personal Dashboard
          </h1>
          <p className="text-slate-300 text-lg">
            Your command center for productivity and inspiration
          </p>
        </div>

        {/* Layout Controls */}
        <LayoutControls 
          currentLayout={layoutMode} 
          onLayoutChange={(mode) => {
            setLayoutMode(mode);
            if (mode !== 'custom') addToSequence('grid');
          }}
          customLayout={customLayout}
          onCustomLayoutLoad={handleCustomLayoutLoad}
          onCustomLayoutSave={handleCustomLayoutSave}
          onGridClick={() => addToSequence('grid')}
          onCustomClick={() => addToSequence('custom')}
        />

        {/* Dashboard Content */}
        {renderLayout()}
      </div>
    </div>
  );
};

export default AppLayout;