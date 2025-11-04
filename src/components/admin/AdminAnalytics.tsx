import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, TrendingUp, Activity } from 'lucide-react';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    totalConversations: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total messages
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Get total conversations
      const { count: conversationsCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true });

      // Get active users (users with conversations in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activeConversations } = await supabase
        .from('conversations')
        .select('user_id')
        .gte('updated_at', sevenDaysAgo.toISOString());

      const uniqueActiveUsers = new Set(
        activeConversations?.map((c) => c.user_id).filter(Boolean)
      ).size;

      setStats({
        totalUsers: usersCount || 0,
        totalMessages: messagesCount || 0,
        totalConversations: conversationsCount || 0,
        activeUsers: uniqueActiveUsers,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'text-green-500',
    },
    {
      title: 'Conversations',
      value: stats.totalConversations,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Active Users (7d)',
      value: stats.activeUsers,
      icon: Activity,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Analytics charts and detailed reports will be available in the next phase.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;