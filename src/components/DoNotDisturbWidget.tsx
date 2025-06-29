import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BellOff, Bell, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DoNotDisturbWidget: React.FC = () => {
  const [isDndEnabled, setIsDndEnabled] = useState(false);
  const [scheduledDnd, setScheduledDnd] = useState(false);
  const [dndUntil, setDndUntil] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isDndEnabled && dndUntil) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = dndUntil.getTime() - now.getTime();
        
        if (diff <= 0) {
          setIsDndEnabled(false);
          setDndUntil(null);
          setTimeRemaining('');
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`${hours}h ${minutes}m`);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isDndEnabled, dndUntil]);

  const toggleDnd = () => {
    setIsDndEnabled(!isDndEnabled);
    if (!isDndEnabled) {
      // Enable DND indefinitely
      setDndUntil(null);
      setTimeRemaining('');
    }
  };

  const enableDndFor = (minutes: number) => {
    const until = new Date(Date.now() + minutes * 60 * 1000);
    setIsDndEnabled(true);
    setDndUntil(until);
  };

  const enableScheduledDnd = () => {
    setScheduledDnd(!scheduledDnd);
    if (!scheduledDnd) {
      // In a real app, this would integrate with calendar/work hours
      alert('Scheduled DND would integrate with your calendar and work hours');
    }
  };

  const quickDndOptions = [
    { label: '30m', minutes: 30 },
    { label: '1h', minutes: 60 },
    { label: '2h', minutes: 120 },
    { label: '4h', minutes: 240 }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          {isDndEnabled ? (
            <BellOff className="h-5 w-5 text-red-400" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          Do Not Disturb
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main DND Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-white font-medium">
              {isDndEnabled ? 'DND Active' : 'DND Inactive'}
            </div>
            {isDndEnabled && timeRemaining && (
              <div className="text-sm text-slate-400">
                {timeRemaining} remaining
              </div>
            )}
            {isDndEnabled && !dndUntil && (
              <div className="text-sm text-slate-400">
                Until manually disabled
              </div>
            )}
          </div>
          <Switch
            checked={isDndEnabled}
            onCheckedChange={toggleDnd}
            className="data-[state=checked]:bg-red-600"
          />
        </div>

        {/* Status Badge */}
        {isDndEnabled && (
          <Badge 
            variant="secondary" 
            className="bg-red-600/20 text-red-400 border-red-600/30"
          >
            Notifications blocked
          </Badge>
        )}

        {/* Quick DND Options */}
        {!isDndEnabled && (
          <div className="space-y-2">
            <div className="text-sm text-slate-300 font-medium">Quick Enable</div>
            <div className="grid grid-cols-4 gap-2">
              {quickDndOptions.map((option) => (
                <Button
                  key={option.minutes}
                  variant="ghost"
                  size="sm"
                  onClick={() => enableDndFor(option.minutes)}
                  className="text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled DND */}
        <div className="border-t border-slate-700 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-300">Scheduled DND</span>
            </div>
            <Switch
              checked={scheduledDnd}
              onCheckedChange={enableScheduledDnd}
            />
          </div>
          {scheduledDnd && (
            <div className="mt-2 text-xs text-slate-400">
              Auto-enable during work hours and calendar events
            </div>
          )}
        </div>

        {/* Current Status */}
        <div className="bg-slate-700/30 rounded-lg p-3 space-y-2">
          <div className="text-xs text-slate-400 uppercase tracking-wide">Status</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isDndEnabled ? 'bg-red-400' : 'bg-green-400'
            }`}></div>
            <span className="text-sm text-white">
              {isDndEnabled 
                ? 'All notifications are blocked' 
                : 'Notifications are allowed'
              }
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 text-center">
          Note: Integrates with OS notifications and calendar in desktop app
        </div>
      </CardContent>
    </Card>
  );
};

export default DoNotDisturbWidget;