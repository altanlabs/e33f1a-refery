import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-[85%]">
        {/* Avatar */}
        <Avatar className="h-8 w-8 border-2 border-emerald-200 dark:border-emerald-700 flex-shrink-0">
          <AvatarImage src="/refery-bot-avatar.png" />
          <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>

        {/* Typing Animation */}
        <div className="chat-bubble bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/30 dark:to-cyan-900/30 border border-emerald-100 dark:border-emerald-800 px-4 py-3 rounded-2xl shadow-sm">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="typing-dot w-2 h-2 bg-emerald-500 rounded-full" />
              <div className="typing-dot w-2 h-2 bg-emerald-500 rounded-full" />
              <div className="typing-dot w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              Refery is typing...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}