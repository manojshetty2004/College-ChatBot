import { Message } from '@/types';
import { Bot, User, ThumbsUp, ThumbsDown, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { addFeedback } = useChat();
  const [feedback, setFeedback] = useState<number | null>(null);
  const isUser = message.sender_type === 'user';
  const isSystem = message.sender_type === 'system';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: 'Copied',
      description: 'Message copied to clipboard',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        text: message.content,
      });
    } else {
      handleCopy();
    }
  };

  const handleFeedback = (rating: number) => {
    setFeedback(rating);
    addFeedback(message.id, rating);
  };

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <div className="bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary' : 'bg-secondary'
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-secondary-foreground" />
        )}
      </div>

      <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>

          {!isUser && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleFeedback(1)}
              >
                <ThumbsUp
                  className={`h-3 w-3 ${feedback === 1 ? 'fill-primary text-primary' : ''}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleFeedback(-1)}
              >
                <ThumbsDown
                  className={`h-3 w-3 ${feedback === -1 ? 'fill-destructive text-destructive' : ''}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
