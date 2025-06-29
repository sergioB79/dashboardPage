import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, TrendingUp, FileText, MessageCircle, ExternalLink } from 'lucide-react';

interface QuickLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

const QuickLinksWidget: React.FC = () => {
  const quickLinks: QuickLink[] = [
    {
      name: 'Gmail',
      url: 'https://mail.google.com',
      icon: <Mail className="h-5 w-5" />,
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      name: 'TradingView',
      url: 'tradingview://',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Obsidian',
      url: 'obsidian://open',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'ChatGPT',
      url: 'https://chat.openai.com',
      icon: <MessageCircle className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600'
    }
  ];

  const handleLinkClick = (url: string, name: string) => {
    if (name === 'TradingView') {
      // Try to open app first, fallback to web
      window.location.href = url;
      setTimeout(() => {
        window.open('https://www.tradingview.com', '_blank');
      }, 1000);
    } else if (name === 'Obsidian') {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950 dark:to-slate-900 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Button
              key={link.name}
              onClick={() => handleLinkClick(link.url, link.name)}
              className={`${link.color} text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 h-12`}
            >
              <div className="flex items-center space-x-2">
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </div>
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLinksWidget;