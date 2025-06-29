import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Power, Lock, Moon, RotateCcw, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SystemActionsWidget: React.FC = () => {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const executeSystemAction = (action: string) => {
    setLastAction(action);
    
    // In a real desktop app, these would call actual system APIs
    switch (action) {
      case 'lock':
        alert('Lock screen would be executed (requires desktop app)');
        break;
      case 'sleep':
        alert('Sleep mode would be executed (requires desktop app)');
        break;
      case 'restart':
        alert('System restart would be executed (requires desktop app)');
        break;
      case 'shutdown':
        alert('System shutdown would be executed (requires desktop app)');
        break;
      default:
        break;
    }
    
    // Clear the last action after 3 seconds
    setTimeout(() => setLastAction(null), 3000);
  };

  const systemActions = [
    {
      id: 'lock',
      label: 'Lock Screen',
      icon: Lock,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Lock your screen'
    },
    {
      id: 'sleep',
      label: 'Sleep',
      icon: Moon,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Put system to sleep'
    },
    {
      id: 'restart',
      label: 'Restart',
      icon: RotateCcw,
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Restart system'
    },
    {
      id: 'shutdown',
      label: 'Shut Down',
      icon: Power,
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Shut down system'
    }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastAction && (
          <Alert className="bg-slate-700/50 border-slate-600">
            <AlertDescription className="text-slate-300">
              Action '{lastAction}' would be executed in a desktop environment
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {systemActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                onClick={() => executeSystemAction(action.id)}
                className={`${action.color} text-white h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105`}
              >
                <IconComponent className="h-6 w-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="text-xs text-slate-400 text-center mt-4">
          Note: System actions require desktop app integration
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemActionsWidget;