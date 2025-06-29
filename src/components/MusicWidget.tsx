import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Track {
  title: string;
  artist: string;
  album: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  artwork?: string;
}

interface Playlist {
  id: string;
  name: string;
  type: 'playlist' | 'podcast';
  trackCount?: number;
}

interface MusicWidgetProps {
  onSpotifyClick?: () => void;
  onYouTubeClick?: () => void;
}

const MusicWidget: React.FC<MusicWidgetProps> = ({ onSpotifyClick, onYouTubeClick }) => {
  const [currentTrack, setCurrentTrack] = useState<Track>({
    title: 'No track playing',
    artist: 'Unknown Artist',
    album: 'Unknown Album',
    duration: 0,
    currentTime: 0,
    isPlaying: false
  });

  const [favorites] = useState<Playlist[]>([
    { id: '1', name: 'Chill Vibes', type: 'playlist', trackCount: 42 },
    { id: '2', name: 'Focus Music', type: 'playlist', trackCount: 28 },
    { id: '3', name: 'Tech Podcast', type: 'podcast', trackCount: 15 },
    { id: '4', name: 'Morning Mix', type: 'playlist', trackCount: 35 }
  ]);

  const [connectedService, setConnectedService] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTrack({
      title: 'Ambient Soundscape',
      artist: 'Focus Beats',
      album: 'Productivity Mix',
      duration: 240,
      currentTime: 120,
      isPlaying: true
    });
  }, []);

  const togglePlayPause = () => {
    setCurrentTrack(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleSpotifyClick = () => {
    if (onSpotifyClick) onSpotifyClick();
    if (!connectedService) {
      setConnectedService('Spotify');
      alert('Spotify integration would be implemented here');
    }
  };

  const handleYouTubeClick = () => {
    if (onYouTubeClick) onYouTubeClick();
    if (!connectedService) {
      setConnectedService('YouTube Music');
      alert('YouTube Music integration would be implemented here');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = currentTrack.duration > 0 
    ? (currentTrack.currentTime / currentTrack.duration) * 100 
    : 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Music className="h-5 w-5" />
          Music Controller
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Always visible service buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSpotifyClick}
            className="bg-green-600 hover:bg-green-700 flex-1"
          >
            Spotify
          </Button>
          <Button
            size="sm"
            onClick={handleYouTubeClick}
            className="bg-red-600 hover:bg-red-700 flex-1"
          >
            YouTube
          </Button>
        </div>

        {/* Current Track */}
        <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
              <Music className="h-6 w-6 text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{currentTrack.title}</h4>
              <p className="text-slate-300 text-sm truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-1" />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{formatTime(currentTrack.currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              className="text-slate-300 hover:text-white"
            >
              {currentTrack.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h5 className="text-white text-sm font-medium">Quick Access</h5>
          <div className="grid grid-cols-2 gap-2">
            {favorites.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className="justify-start text-slate-300 hover:text-white h-auto p-2"
              >
                <div className="text-left">
                  <div className="font-medium text-xs">{item.name}</div>
                  <div className="text-xs text-slate-500">
                    {item.type === 'playlist' ? `${item.trackCount} tracks` : `${item.trackCount} episodes`}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicWidget;