import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const isUser = message.sender === 'user';
  const isFile = message.type === 'file';

  const handleFileDownload = () => {
    if (message.fileUrl && message.fileName) {
      const link = document.createElement('a');
      link.href = message.fileUrl;
      link.download = message.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return FileText;
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return ImageIcon;
    }
    return FileText;
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex items-start space-x-3 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        {!isUser && (
          <Avatar className="h-8 w-8 border-2 border-emerald-200 dark:border-emerald-700 flex-shrink-0">
            <AvatarImage src="/refery-bot-avatar.png" />
            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}

        {isUser && (
          <Avatar className="h-8 w-8 border-2 border-blue-200 dark:border-blue-700 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}

        {/* Message Content */}
        <div
          className={`relative group cursor-pointer transition-all duration-200 ${
            isUser ? 'items-end' : 'items-start'
          }`}
          onMouseEnter={() => setShowTimestamp(true)}
          onMouseLeave={() => setShowTimestamp(false)}
        >
          {/* Message Bubble */}
          <div
            className={`chat-bubble px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${
              isUser
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-auto'
                : 'bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/30 dark:to-cyan-900/30 text-gray-900 dark:text-white border border-emerald-100 dark:border-emerald-800'
            } ${isFile ? 'p-2' : ''}`}
          >
            {isFile ? (
              <div className="flex items-center space-x-3 min-w-[200px]">
                <div className={`p-2 rounded-lg ${isUser ? 'bg-white/20' : 'bg-emerald-100 dark:bg-emerald-800'}`}>
                  {React.createElement(getFileIcon(message.fileName), {
                    className: `h-5 w-5 ${isUser ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isUser ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {message.fileName}
                  </p>
                  <p className={`text-sm ${isUser ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                    {message.content}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFileDownload}
                  className={`h-8 w-8 p-0 ${
                    isUser 
                      ? 'hover:bg-white/20 text-white' 
                      : 'hover:bg-emerald-100 dark:hover:bg-emerald-800 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
          </div>

          {/* Timestamp */}
          {showTimestamp && (
            <div
              className={`timestamp absolute top-full mt-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 z-10 ${
                isUser ? 'right-0' : 'left-0'
              }`}
            >
              {format(message.timestamp, 'HH:mm')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}