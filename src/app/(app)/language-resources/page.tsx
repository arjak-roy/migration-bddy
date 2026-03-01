'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';
import { FileText, Video, BookCopy, Download } from 'lucide-react';

const resourceLevels = [
  {
    level: 'A1',
    title: 'A1 Resources',
    description: 'Foundation materials for beginners.',
    content: [
      { type: 'Mock Papers', icon: FileText },
      { type: 'Class Plan', icon: BookCopy },
      { type: 'Videos', icon: Video },
    ],
  },
  {
    level: 'A2',
    title: 'A2 Resources',
    description: 'Building on the basics for elementary users.',
     content: [
      { type: 'Mock Papers', icon: FileText },
      { type: 'Class Plan', icon: BookCopy },
      { type: 'Videos', icon: Video },
    ],
  },
  {
    level: 'B1',
    title: 'B1 Resources',
    description: 'Intermediate level materials for independent users.',
     content: [
      { type: 'Mock Papers', icon: FileText },
      { type: 'Class Plan', icon: BookCopy },
      { type: 'Videos', icon: Video },
    ],
  },
  {
    level: 'B2',
    title: 'B2 Resources',
    description: 'Upper-intermediate resources for advanced topics.',
     content: [
      { type: 'Mock Papers', icon: FileText },
      { type: 'Class Plan', icon: BookCopy },
      { type: 'Videos', icon: Video },
    ],
  },
];

export default function LanguageResourcesPage() {
  const { completeStep, isStepUnlocked } = useProgress();
  const router = useRouter();

  if (!isStepUnlocked('language-resources')) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Section Locked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please complete the previous steps in your pathway to unlock this
              section.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleCompletion = () => {
    completeStep('language-resources');
    router.push('/dashboard');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold">Language Resources</h1>
        <p className="mt-2 text-muted-foreground">
          Find materials to help you prepare for your German language exams.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {resourceLevels.map((level) => (
          <Card key={level.level} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{level.title}</CardTitle>
              <CardDescription>{level.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
               <p className="text-sm font-semibold text-muted-foreground">
                Coming soon:
              </p>
              <ul className="space-y-3">
                {level.content.map(item => {
                    const Icon = item.icon;
                    return (
                        <li key={item.type} className="flex items-center justify-between rounded-md border bg-background/50 p-3">
                             <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5 text-primary" />
                                <span className="font-medium">{item.type}</span>
                            </div>
                           <Button variant="outline" size="sm" disabled>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </li>
                    )
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={handleCompletion}>Mark as Reviewed and Continue</Button>
      </div>
    </div>
  );
}
