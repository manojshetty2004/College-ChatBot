import { Bot, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  isOnline: boolean;
}

const ChatHeader = ({ onToggleSidebar, isOnline }: ChatHeaderProps) => {
  return (
    <div className="border-b bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-8 w-8 text-primary" />
              <div
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
            </div>
            <div>
              <h2 className="font-semibold">DBIT Assistant</h2>
              <Badge variant={isOnline ? 'default' : 'secondary'} className="text-xs">
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
