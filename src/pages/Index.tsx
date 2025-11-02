import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { MessageSquare, BookOpen, Users, Bell, Calendar, FileText } from 'lucide-react';

const Index = () => {
  const quickActions = [
    { icon: Calendar, label: 'View Timetable', path: '/chat?q=timetable' },
    { icon: FileText, label: 'Exam Schedule', path: '/chat?q=exams' },
    { icon: Users, label: 'Faculty Info', path: '/chat?q=faculty' },
    { icon: Bell, label: 'Announcements', path: '/chat?q=notices' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            DBIT Chat Bot
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Your intelligent digital assistant for instant access to college information, schedules, and resources
          </p>
          <Button asChild size="lg" className="animate-scale-in">
            <Link to="/chat">
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Card className="p-4 text-center hover:bg-primary/5 transition-all hover-scale cursor-pointer">
                  <action.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{action.label}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover-scale transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Course Information</h3>
              <p className="text-muted-foreground">
                Access detailed course catalogs, schedules, and academic requirements
              </p>
            </Card>

            <Card className="text-center p-6 hover-scale transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Faculty Directory</h3>
              <p className="text-muted-foreground">
                Find faculty contact information, office hours, and specializations
              </p>
            </Card>

            <Card className="text-center p-6 hover-scale transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Events & Notices</h3>
              <p className="text-muted-foreground">
                Stay updated with campus events, announcements, and important deadlines
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students using DBIT Chat Bot for quick access to college information
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/signup">Sign Up Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
