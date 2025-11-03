import { BookOpen, Calendar, Users, Info, Bell, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';

const quickActions = [
  {
    icon: BookOpen,
    label: 'Course Information',
    query: 'What courses are available this semester?',
  },
  {
    icon: Calendar,
    label: 'Exam Schedule',
    query: 'When are the upcoming exams?',
  },
  {
    icon: Users,
    label: 'Faculty Directory',
    query: 'Show me the faculty directory',
  },
  {
    icon: Bell,
    label: 'Latest Announcements',
    query: 'What are the latest announcements?',
  },
  {
    icon: Info,
    label: 'Campus Events',
    query: 'What events are happening on campus?',
  },
  {
    icon: HelpCircle,
    label: 'FAQ',
    query: 'Show me frequently asked questions',
  },
];

const QuickActions = () => {
  const { sendMessage, messages } = useChat();

  if (messages.length > 0) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome to DBIT Chat Bot</h2>
        <p className="text-muted-foreground">
          How can I help you today? Select a quick action or type your question.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto flex-col gap-2 p-4 hover:bg-accent hover:scale-105 transition-all"
            onClick={() => sendMessage(action.query)}
          >
            <action.icon className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
