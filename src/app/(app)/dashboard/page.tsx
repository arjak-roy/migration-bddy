import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  BarChart3,
  NotebookText,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

const pathwaySteps = [
  { name: 'Complete Profile', completed: true, href: '/profile' },
  { name: 'German Readiness Assessment', completed: true, href: '/assessment' },
  { name: 'Review Personalized Resources', completed: false, href: '/assessment' },
  { name: 'Study German & Track Progress', completed: false, href: '#' },
  { name: 'Apply for Jobs', completed: false, href: '/jobs' },
  { name: 'Begin Visa Process', completed: false, href: '/guide' },
];

const quickLinks = [
  { name: 'Take Assessment', href: '/assessment', icon: BarChart3 },
  { name: 'Read Career Guide', href: '/guide', icon: NotebookText },
  { name: 'Find Jobs', href: '/jobs', icon: Briefcase },
];

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Welcome back, Alex!</CardTitle>
            <CardDescription>
              Here's your personalized pathway to Germany. Let's continue your journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Your Progress Pathway</h3>
              <div className="flex flex-col gap-4">
                {pathwaySteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {step.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-muted-foreground line-through' : ''}`}>
                        {step.name}
                      </p>
                    </div>
                    {!step.completed && (
                       <Button variant="ghost" size="sm" asChild>
                         <Link href={step.href}>
                           Start <ArrowRight className="ml-2 h-4 w-4" />
                         </Link>
                       </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Next Step</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start space-y-4">
            <h4 className="font-semibold text-lg">Review Personalized Resources</h4>
            <p className="text-muted-foreground text-sm">
              Your AI-powered assessment has generated a list of language learning resources tailored just for you.
            </p>
            <Button asChild>
              <Link href="/assessment">
                View Resources <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <Button key={link.name} variant="outline" className="justify-start" asChild>
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
