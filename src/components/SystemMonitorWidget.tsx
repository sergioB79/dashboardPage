import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cpu, HardDrive, Wifi, Battery, Monitor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  network: { up: number; down: number };
  battery?: number;
  gpu?: number;
}

const SystemMonitorWidget: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: { up: 0, down: 0 },
    battery: 85,
    gpu: 0
  });

  useEffect(() => {
    // Mock system stats with realistic variations
    const updateStats = () => {
      setStats({
        cpu: Math.floor(Math.random() * 60) + 20, // 20-80%
        memory: Math.floor(Math.random() * 40) + 40, // 40-80%
        disk: 65, // Static for demo
        network: {
          up: Math.floor(Math.random() * 50) + 10, // 10-60 Mbps
          down: Math.floor(Math.random() * 100) + 50 // 50-150 Mbps
        },
        battery: Math.max(0, 85 - Math.floor(Math.random() * 5)), // Slowly decreasing
        gpu: Math.floor(Math.random() * 70) + 15 // 15-85%
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds = { warning: 70, critical: 90 }) => {
    if (value >= thresholds.critical) return 'text-red-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBatteryColor = (value: number) => {
    if (value <= 20) return 'text-red-400';
    if (value <= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          System Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CPU */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-slate-300">CPU</span>
            </div>
            <Badge variant="secondary" className={getStatusColor(stats.cpu)}>
              {stats.cpu}%
            </Badge>
          </div>
          <Progress value={stats.cpu} className="h-2" />
        </div>

        {/* Memory */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-slate-300">Memory</span>
            </div>
            <Badge variant="secondary" className={getStatusColor(stats.memory)}>
              {stats.memory}%
            </Badge>
          </div>
          <Progress value={stats.memory} className="h-2" />
        </div>

        {/* GPU */}
        {stats.gpu !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-300">GPU</span>
              </div>
              <Badge variant="secondary" className={getStatusColor(stats.gpu)}>
                {stats.gpu}%
              </Badge>
            </div>
            <Progress value={stats.gpu} className="h-2" />
          </div>
        )}

        {/* Disk */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-slate-300">Disk</span>
            </div>
            <Badge variant="secondary" className={getStatusColor(stats.disk)}>
              {stats.disk}%
            </Badge>
          </div>
          <Progress value={stats.disk} className="h-2" />
        </div>

        {/* Network */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-slate-300">Network I/O</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="text-center">
              <div className="text-green-400 font-mono">{stats.network.up} Mbps</div>
              <div className="text-slate-500">Upload</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-mono">{stats.network.down} Mbps</div>
              <div className="text-slate-500">Download</div>
            </div>
          </div>
        </div>

        {/* Battery */}
        {stats.battery !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-slate-300">Battery</span>
              </div>
              <Badge variant="secondary" className={getBatteryColor(stats.battery)}>
                {stats.battery}%
              </Badge>
            </div>
            <Progress value={stats.battery} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemMonitorWidget;