import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Bell, BellOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

const CalendarWidget: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notifications, setNotifications] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Mock events for demo
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Team Meeting',
        start: new Date(Date.now() + 30 * 60 * 1000),
        end: new Date(Date.now() + 90 * 60 * 1000),
        description: 'Weekly team sync',
        location: 'Conference Room A'
      },
      {
        id: '2',
        title: 'Project Deadline',
        start: new Date(Date.now() + 2 * 60 * 60 * 1000),
        end: new Date(Date.now() + 3 * 60 * 60 * 1000),
        description: 'Submit final report'
      }
    ];
    setEvents(mockEvents);
  }, []);

  const connectGoogleCalendar = () => {
    // In a real app, this would initiate OAuth flow
    alert('Google Calendar integration would be implemented here');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeUntil = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Events
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications(!notifications)}
              className="text-slate-300 hover:text-white"
            >
              {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <Button
            onClick={connectGoogleCalendar}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Connect Google Calendar
          </Button>
        )}
        
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No upcoming events</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-slate-700/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-white font-medium">{event.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {getTimeUntil(event.start)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                </div>
                {event.description && (
                  <p className="text-sm text-slate-400">{event.description}</p>
                )}
                {event.location && (
                  <p className="text-xs text-slate-500">{event.location}</p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;