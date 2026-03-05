'use client';

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
  Lock,
  BookCopy,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useProgress, initialPathwaySteps } from '@/context/ProgressContext';

const quickLinks = [
  { id: 'assessment', name: 'Take Assessment', href: '/assessment', icon: BarChart3 },
  { id: 'prediction', name: 'Migration Prediction', href: '/prediction', icon: Sparkles },
  { id: 'guide', name: 'Read Career Guide', href: '/guide', icon: NotebookText },
  { id: 'language-resources', name: 'View Language Resources', href: '/language-resources', icon: BookCopy },
  { id: 'jobs', name: 'Find Jobs', href: '/jobs', icon: Briefcase },
];

export default function DashboardPage() {
  const { isStepCompleted, isStepUnlocked } = useProgress();

  const pathwaySteps = initialPathwaySteps.map((step) => ({
    ...step,
    completed: isStepCompleted(step.id),
    unlocked: isStepUnlocked(step.id),
  }));

  const nextStep = pathwaySteps.find((step) => !step.completed);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline">Welcome back, Alex!</CardTitle>
            <CardDescription>
              Here's your personalized pathway to Germany. Let's continue your
              journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Your Progress Pathway</h3>
              <div className="flex flex-col gap-4">
                {pathwaySteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {step.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle
                        className={`h-6 w-6 ${
                          step.unlocked
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    )}
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          !step.unlocked ? 'text-muted-foreground' : ''
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                    {!step.completed && step.unlocked && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={step.href}>
                          Start <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                     {!step.completed && !step.unlocked && (
                       <Button variant="ghost" size="sm" disabled>
                         <Lock className="mr-2 h-4 w-4" />
                         Locked
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
        {nextStep ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Next Step</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start space-y-4">
              <h4 className="text-lg font-semibold">{nextStep.name}</h4>
              <p className="text-sm text-muted-foreground">
                {nextStep.description}
              </p>
              <Button asChild disabled={!nextStep.unlocked}>
                <Link href={nextStep.href}>
                  {nextStep.unlocked ? (
                    <>
                      Start Now <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                     <>
                      <Lock className="mr-2 h-4 w-4" />
                      Locked
                    </>
                  )}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
           <Card>
            <CardHeader>
                <CardTitle className="font-headline">Pathway Complete!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Congratulations! You have completed all the initial steps.</p>
            </CardContent>
        </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {quickLinks.map((link) => {
              const unlocked = isStepUnlocked(link.id)
              return (
              <Button
                key={link.name}
                variant="outline"
                className="justify-start"
                asChild
                disabled={!unlocked}
              >
                <Link href={unlocked ? link.href : '#'}>
                  {unlocked ? <link.icon className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                  {link.name}
                </Link>
              </Button>
            )})}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
