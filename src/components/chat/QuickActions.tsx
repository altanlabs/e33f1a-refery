import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Zap } from 'lucide-react';

interface QuickAction {
  label: string;
  action: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (action: string) => void;
  onClose: () => void;
}

export function QuickActions({ actions, onActionClick, onClose }: QuickActionsProps) {
  return (
    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Quick Actions
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onActionClick(action.action)}
              className="quick-action-btn h-auto p-3 text-left justify-start bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-emerald-200 dark:border-emerald-700 hover:from-emerald-100 hover:to-cyan-100 dark:hover:from-emerald-900/40 dark:hover:to-cyan-900/40 transition-all duration-200"
            >
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}