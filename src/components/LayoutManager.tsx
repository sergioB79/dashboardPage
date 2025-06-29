import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Save, FolderOpen, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WidgetLayout {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}

interface SavedLayout {
  name: string;
  widgets: Record<string, WidgetLayout>;
  createdAt: string;
}

interface LayoutManagerProps {
  currentLayout: Record<string, WidgetLayout>;
  onLayoutLoad: (layout: Record<string, WidgetLayout>) => void;
  onLayoutSave: (name: string) => void;
}

const LayoutManager: React.FC<LayoutManagerProps> = ({
  currentLayout,
  onLayoutLoad,
  onLayoutSave
}) => {
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('dashboard-layouts');
    if (saved) {
      setSavedLayouts(JSON.parse(saved));
    }
  }, []);

  const saveLayout = () => {
    if (!newLayoutName.trim()) {
      toast({ title: 'Error', description: 'Please enter a layout name' });
      return;
    }

    const newLayout: SavedLayout = {
      name: newLayoutName,
      widgets: currentLayout,
      createdAt: new Date().toISOString()
    };

    const updated = [...savedLayouts.filter(l => l.name !== newLayoutName), newLayout];
    setSavedLayouts(updated);
    localStorage.setItem('dashboard-layouts', JSON.stringify(updated));
    setNewLayoutName('');
    onLayoutSave(newLayoutName);
    toast({ title: 'Success', description: `Layout "${newLayoutName}" saved!` });
  };

  const loadLayout = (layout: SavedLayout) => {
    onLayoutLoad(layout.widgets);
    toast({ title: 'Success', description: `Layout "${layout.name}" loaded!` });
  };

  const deleteLayout = (layoutName: string) => {
    const updated = savedLayouts.filter(l => l.name !== layoutName);
    setSavedLayouts(updated);
    localStorage.setItem('dashboard-layouts', JSON.stringify(updated));
    toast({ title: 'Success', description: `Layout "${layoutName}" deleted!` });
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="bg-slate-800/50 border-slate-700 text-slate-300 hover:text-white"
      >
        <Save className="h-4 w-4 mr-2" />
        Layout Manager
      </Button>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-300">Layout Manager</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
          className="text-slate-400 hover:text-white"
        >
          ×
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Layout name"
            value={newLayoutName}
            onChange={(e) => setNewLayoutName(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
          <Button onClick={saveLayout} size="sm">
            <Save className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {savedLayouts.map((layout) => (
            <div key={layout.name} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded">
              <span className="flex-1 text-sm text-slate-300 truncate">{layout.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadLayout(layout)}
                className="text-slate-400 hover:text-white"
              >
                <FolderOpen className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteLayout(layout.name)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LayoutManager;