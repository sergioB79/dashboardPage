import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const inspirationalMessages = [
  "Every moment is a fresh beginning. Make it count.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Don't stop when you're tired. Stop when you're done."
];

const InspirationWidget: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const updateMessage = () => {
      const hour = new Date().getHours();
      const messageIndex = Math.floor((hour / 24) * inspirationalMessages.length);
      setCurrentMessage(inspirationalMessages[messageIndex]);
    };

    updateMessage();
    const interval = setInterval(updateMessage, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-lg font-medium text-purple-900 dark:text-purple-100 leading-relaxed">
              {currentMessage}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">
              Daily Inspiration
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspirationWidget;