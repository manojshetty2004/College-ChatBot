import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageSquare, BookOpen, Users, Bell } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            DBIT Chat Bot
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your intelligent digital assistant for instant access to college information, schedules, and resources
          </p>
          <Button asChild size="lg">
            <Link to="/chat">
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Course Information</h3>
              <p className="text-muted-foreground">
                Access detailed course catalogs, schedules, and academic requirements
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Faculty Directory</h3>
              <p className="text-muted-foreground">
                Find faculty contact information, office hours, and specializations
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Events & Notices</h3>
              <p className="text-muted-foreground">
                Stay updated with campus events, announcements, and important deadlines
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
