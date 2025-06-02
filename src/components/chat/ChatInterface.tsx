import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Send, 
  Mic, 
  Plus, 
  MessageCircle, 
  X, 
  HelpCircle,
  Paperclip,
  Bot,
  User,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { QuickActions } from './QuickActions';
import { ChatSidebar } from './ChatSidebar';
import { FileUpload } from './FileUpload';
import './chat.css';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
}

const placeholderMessages = [
  "Ask me how to post a job",
  "Track my referral reward",
  "What's the status of my candidate?",
  "How do I refer someone?",
  "What happens after a candidate is hired?",
  "How do payouts work?"
];

export function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Refery, your referral hiring companion. I'm here to help you navigate our platform, track your referrals, and maximize your earning potential. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (content: string, type: 'text' | 'file' = 'text', fileData?: any) => {
    if (!content.trim() && type === 'text') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type,
      ...fileData
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('post') && lowerMessage.includes('job')) {
      return "To post a job on Refery, go to your dashboard and click 'Post New Job'. You'll need to provide job details, requirements, and set a referral reward. Our AI will help optimize your job posting for maximum visibility to quality referrers.";
    }
    
    if (lowerMessage.includes('referral') && lowerMessage.includes('reward')) {
      return "You can track your referral rewards in real-time through your dashboard. Navigate to 'My Referrals' to see the status of each referral and expected payout dates. Rewards are typically processed within 30 days of successful candidate placement.";
    }
    
    if (lowerMessage.includes('refer') && lowerMessage.includes('someone')) {
      return "Referring someone is easy! Browse our job board, find a position that matches your contact's skills, and click 'Refer Someone'. You'll provide their details and a personal recommendation. Our team will handle the rest and keep you updated on the progress.";
    }
    
    if (lowerMessage.includes('payout')) {
      return "Payouts are processed monthly for all successful placements. You can set up direct deposit or PayPal in your account settings. We offer some of the highest referral rewards in the industry - up to $15,000 per successful placement!";
    }
    
    return "I'm here to help with any questions about Refery! Whether you need assistance with posting jobs, making referrals, tracking rewards, or understanding our platform features, just ask. You can also use the quick actions below for common tasks.";
  };

  const handleQuickAction = (action: string) => {
    setShowQuickActions(false);
    handleSendMessage(action);
  };

  const handleFileUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    handleSendMessage(`Uploaded: ${file.name}`, 'file', {
      fileUrl,
      fileName: file.name
    });
    setShowFileUpload(false);
  };

  const quickActions = [
    { label: 'Refer someone', action: 'I want to refer someone for a job' },
    { label: 'Post a job', action: 'How do I post a new job?' },
    { label: 'View dashboard', action: 'Take me to my dashboard' },
    { label: 'Check rewards', action: 'Show me my referral rewards' }
  ];

  return (
    <>
      {/* Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="chat-trigger h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-2xl shadow-emerald-500/25 transform hover:scale-110 transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Chat Interface */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className="chat-container w-full sm:w-[480px] p-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-l-2 border-emerald-200 dark:border-emerald-800"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-emerald-200 dark:border-emerald-700">
                    <AvatarImage src="/refery-bot-avatar.png" />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="online-indicator absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    You're chatting with Refery
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your referral hiring companion
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ChatSidebar />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isTyping && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="px-4 pb-2">
                <QuickActions 
                  actions={quickActions}
                  onActionClick={handleQuickAction}
                  onClose={() => setShowQuickActions(false)}
                />
              </div>
            )}

            {/* File Upload */}
            {showFileUpload && (
              <div className="px-4 pb-2">
                <FileUpload 
                  onFileUpload={handleFileUpload}
                  onClose={() => setShowFileUpload(false)}
                />
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputValue);
                      }
                    }}
                    placeholder={placeholderMessages[currentPlaceholder]}
                    className="chat-input pr-20 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-2xl min-h-[44px] transition-all duration-200"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFileUpload(!showFileUpload)}
                      className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                    >
                      <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                    >
                      <Mic className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="quick-action-btn h-11 w-11 p-0 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-2xl"
                >
                  <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Button>
                
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="h-11 w-11 p-0 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-2xl shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:shadow-none transform hover:scale-105 transition-all duration-200"
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}