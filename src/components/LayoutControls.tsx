import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, Maximize2, BarChart3 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LayoutManager from './LayoutManager';

export type LayoutMode = 'multi-tile' | 'single-panel' | 'forex-mode' | 'custom';

interface WidgetLayout {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}

interface LayoutControlsProps {
  currentLayout: LayoutMode;
  onLayoutChange: (layout: LayoutMode) => void;
  customLayout: Record<string, WidgetLayout>;
  onCustomLayoutLoad: (layout: Record<string, WidgetLayout>) => void;
  onCustomLayoutSave: (name: string) => void;
  onGridClick?: () => void;
  onCustomClick?: () => void;
}

const LayoutControls: React.FC<LayoutControlsProps> = ({ 
  currentLayout, 
  onLayoutChange,
  customLayout,
  onCustomLayoutLoad,
  onCustomLayoutSave,
  onGridClick,
  onCustomClick
}) => {
  const layouts = [
    { id: 'multi-tile' as LayoutMode, label: 'Grid', icon: Grid3X3 },
    { id: 'single-panel' as LayoutMode, label: 'Stack', icon: Maximize2 },
    { id: 'forex-mode' as LayoutMode, label: 'Forex', icon: BarChart3 }
  ];

  const handleLayoutClick = (layoutId: LayoutMode) => {
    if (layoutId === 'multi-tile' && onGridClick) {
      onGridClick();
    }
    onLayoutChange(layoutId);
  };

  const handleCustomClick = () => {
    if (onCustomClick) {
      onCustomClick();
    }
    onLayoutChange('custom');
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex gap-2">
        {layouts.map((layout) => {
          const IconComponent = layout.icon;
          const isActive = currentLayout === layout.id;
          
          return (
            <Button
              key={layout.id}
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleLayoutClick(layout.id)}
              className={`flex items-center gap-2 ${
                isActive 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'text-slate-300 hover:text-white bg-slate-800/50 border-slate-700'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {layout.label}
            </Button>
          );
        })}
        <Button
          variant={currentLayout === 'custom' ? 'default' : 'ghost'}
          size="sm"
          onClick={handleCustomClick}
          className={`${
            currentLayout === 'custom'
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'text-slate-300 hover:text-white bg-slate-800/50 border-slate-700'
          }`}
        >
          Custom
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        {currentLayout === 'custom' && (
          <LayoutManager
            currentLayout={customLayout}
            onLayoutLoad={onCustomLayoutLoad}
            onLayoutSave={onCustomLayoutSave}
          />
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default LayoutControls;