import { useState } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = {
    academic: [
      {
        question: 'How do I check my class timetable?',
        answer: 'You can ask the chatbot "Show my timetable" or "What are my classes today?" to view your schedule.',
      },
      {
        question: 'Where can I find course syllabus?',
        answer: 'Ask the bot "Show syllabus for [course name]" to access detailed course information and syllabus.',
      },
      {
        question: 'How do I check exam schedules?',
        answer: 'Simply ask "When are my exams?" or "Show exam timetable" to see your upcoming examination schedule.',
      },
      {
        question: 'Can I get information about prerequisites?',
        answer: 'Yes! Ask "What are the prerequisites for [course name]?" to see required courses.',
      },
    ],
    administrative: [
      {
        question: 'How do I contact faculty members?',
        answer: 'Ask "Faculty contact information" or "Office hours for [faculty name]" to get contact details and availability.',
      },
      {
        question: 'Where is the administrative office located?',
        answer: 'The administrative office is located on the ground floor of the main building. You can also ask the bot for specific department locations.',
      },
      {
        question: 'How do I apply for leave?',
        answer: 'For leave applications, ask the bot "Leave application process" to get detailed instructions and required forms.',
      },
      {
        question: 'What are the college timings?',
        answer: 'Regular college hours are 8:00 AM to 4:30 PM on weekdays. Administrative office hours may vary.',
      },
    ],
    technical: [
      {
        question: 'Is my data secure?',
        answer: 'Yes, we use industry-standard encryption and security practices. Your data is stored securely and never shared without consent.',
      },
      {
        question: 'Can I use the chatbot on mobile?',
        answer: 'Absolutely! The DBIT Chat Bot is fully responsive and works on all devices including smartphones and tablets.',
      },
      {
        question: 'What if the bot doesn\'t understand my question?',
        answer: 'Try rephrasing your question or use the quick action buttons. You can also contact support through the Contact page.',
      },
      {
        question: 'Can I upload documents to the chatbot?',
        answer: 'Yes, registered users can upload documents like timetables or forms, and the bot can help you extract information from them.',
      },
    ],
  };

  const filterFAQs = (faqs: typeof faqCategories.academic) => {
    if (!searchQuery) return faqs;
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-center mb-8">
            Find answers to common questions about DBIT Chat Bot
          </p>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <Tabs defaultValue="academic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="administrative">Administrative</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="academic" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {filterFAQs(faqCategories.academic).map((faq, index) => (
                  <AccordionItem key={index} value={`academic-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="administrative" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {filterFAQs(faqCategories.administrative).map((faq, index) => (
                  <AccordionItem key={index} value={`admin-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="technical" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {filterFAQs(faqCategories.technical).map((faq, index) => (
                  <AccordionItem key={index} value={`tech-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <div className="mt-12 text-center p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Try asking the DBIT Chat Bot or reach out to our support team
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/chat">Ask the Bot</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
