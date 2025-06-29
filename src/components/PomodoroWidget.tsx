import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const PomodoroWidget: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  const modeLabels = {
    work: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
  };

  const modeColors = {
    work: 'bg-red-600',
    shortBreak: 'bg-green-600',
    longBreak: 'bg-blue-600'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    // Play notification sound (in a real app)
    if (mode === 'work') {
      setCompletedPomodoros(prev => prev + 1);
      // Auto-switch to break
      const nextMode = completedPomodoros % 4 === 3 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(durations[nextMode]);
    } else {
      // Break finished, switch to work
      setMode('work');
      setTimeLeft(durations.work);
    }
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${modeLabels[mode]} completed!`, {
        body: mode === 'work' ? 'Time for a break!' : 'Ready to focus?',
        icon: '/placeholder.svg'
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Selector */}
        <div className="flex gap-1 p-1 bg-slate-700/50 rounded-lg">
          {(Object.keys(durations) as TimerMode[]).map((timerMode) => (
            <Button
              key={timerMode}
              variant={mode === timerMode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => switchMode(timerMode)}
              className={`flex-1 text-xs ${
                mode === timerMode 
                  ? `${modeColors[timerMode]} text-white` 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {modeLabels[timerMode]}
            </Button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-6xl font-mono font-bold text-white">
              {formatTime(timeLeft)}
            </div>
            <Badge 
              variant="secondary" 
              className={`mt-2 ${modeColors[mode]} text-white`}
            >
              {modeLabels[mode]}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={toggleTimer}
            className={`${modeColors[mode]} hover:opacity-90 text-white`}
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            variant="ghost"
            onClick={resetTimer}
            className="text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="text-center pt-2 border-t border-slate-700">
          <div className="text-sm text-slate-300">
            Completed Pomodoros: <span className="text-white font-semibold">{completedPomodoros}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroWidget;