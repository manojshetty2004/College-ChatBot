import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary">
        <Bot className="h-4 w-4 text-secondary-foreground" />
      </div>

      <div className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-muted">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default TypingIndicator;
