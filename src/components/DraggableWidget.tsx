import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface DraggableWidgetProps {
  id: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  className?: string;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  children,
  position,
  size,
  onPositionChange,
  onSizeChange,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, e.clientX - dragStart.x);
        const newY = Math.max(0, e.clientY - dragStart.y);
        onPositionChange(id, { x: newX, y: newY });
      }
      if (isResizing && widgetRef.current) {
        const rect = widgetRef.current.getBoundingClientRect();
        const newWidth = Math.max(200, e.clientX - rect.left);
        const newHeight = Math.max(150, e.clientY - rect.top);
        onSizeChange(id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, id, onPositionChange, onSizeChange]);

  return (
    <div
      ref={widgetRef}
      className={`absolute ${className} ${isDragging ? 'z-50' : 'z-10'}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className="h-full bg-slate-800/50 border-slate-700 backdrop-blur-sm relative overflow-hidden">
        <div className="drag-handle absolute top-2 right-2 p-1 hover:bg-slate-700 rounded cursor-grab">
          <GripVertical className="h-4 w-4 text-slate-400" />
        </div>
        <div className="h-full overflow-auto">
          {children}
        </div>
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-slate-600 hover:bg-slate-500"
          onMouseDown={handleResizeStart}
        />
      </Card>
    </div>
  );
};

export default DraggableWidget;