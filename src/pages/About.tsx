import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Bot, Zap, Shield, Users } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Intelligence',
      description: 'Advanced natural language processing to understand and respond to your queries accurately.',
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: '24/7 availability for immediate access to college information whenever you need it.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with industry-standard security measures.',
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Intuitive interface designed for students, faculty, and staff of all tech levels.',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About DBIT Chat Bot</h1>
            <p className="text-xl text-muted-foreground">
              Your intelligent digital assistant for seamless access to college resources
            </p>
          </div>

          {/* Mission */}
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              DBIT Chat Bot was created to revolutionize how students, faculty, and staff access college
              information at Don Bosco Institute of Technology. Our mission is to eliminate the time-consuming
              process of searching through multiple sources and reduce the burden on administrative staff by
              providing instant, accurate answers through an intelligent conversational interface.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe technology should make education more accessible and efficient. By leveraging
              cutting-edge AI technology, we're creating a centralized hub for all college-related queries,
              from academic schedules to campus events, available 24/7 at your fingertips.
            </p>
          </Card>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Key Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* What We Offer */}
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                <span><strong>Course Information:</strong> Comprehensive details about courses, prerequisites, syllabi, and academic requirements</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                <span><strong>Dynamic Timetables:</strong> Real-time access to class schedules, exam timetables, and academic calendars</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                <span><strong>Faculty Directory:</strong> Contact information, office hours, and specializations of faculty members</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                <span><strong>Event Management:</strong> Updates on campus events, workshops, seminars, and important deadlines</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                <span><strong>Official Notices:</strong> Timely announcements, circulars, and urgent notifications</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                <span><strong>Document Processing:</strong> Upload and query documents for instant information extraction</span>
              </li>
            </ul>
          </Card>

          {/* Development Team */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Development Team</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              DBIT Chat Bot is developed and maintained by a dedicated team of students and faculty at
              Don Bosco Institute of Technology. Our team combines expertise in artificial intelligence,
              web development, and user experience design to create a solution that truly serves the
              needs of our college community.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We continuously work to improve the bot's capabilities, expand its knowledge base, and
              enhance the user experience based on feedback from students, faculty, and staff.
            </p>
          </Card>

          {/* Version Info */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>DBIT Chat Bot v1.0.0</p>
            <p>© {new Date().getFullYear()} Don Bosco Institute of Technology. All rights reserved.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
