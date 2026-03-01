'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Phone, XCircle } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

const questions = [
  // English Questions (5 questions, 2 marks each)
  {
    id: 'eng1',
    section: 'English Proficiency',
    text: 'I am ___ nurse.',
    options: [
      { text: 'a', marks: 2 },
      { text: 'an', marks: 0 },
      { text: 'the', marks: 0 },
    ],
  },
  {
    id: 'eng2',
    section: 'English Proficiency',
    text: 'She ___ in the hospital.',
    options: [
      { text: 'work', marks: 0 },
      { text: 'works', marks: 2 },
      { text: 'working', marks: 0 },
    ],
  },
  {
    id: 'eng3',
    section: 'English Proficiency',
    text: "What is the opposite of 'healthy'?",
    options: [
      { text: 'Sick', marks: 2 },
      { text: 'Strong', marks: 0 },
      { text: 'Happy', marks: 0 },
    ],
  },
  {
    id: 'eng4',
    section: 'English Proficiency',
    text: "Choose the correct past tense of 'give'.",
    options: [
      { text: 'Gived', marks: 0 },
      { text: 'Gave', marks: 2 },
      { text: 'Given', marks: 0 },
    ],
  },
  {
    id: 'eng5',
    section: 'English Proficiency',
    text: 'Which of these is a medical instrument?',
    options: [
      { text: 'Hammer', marks: 0 },
      { text: 'Stethoscope', marks: 2 },
      { text: 'Wrench', marks: 0 },
    ],
  },
  // Psychometric Questions (10 questions, 0-2 marks each)
  {
    id: 'psy1',
    section: 'Psychometric Analysis',
    text: 'I am self-motivated and can study independently.',
    options: [
      { text: 'Strongly Disagree', marks: 0 },
      { text: 'Disagree', marks: 0.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 1.5 },
      { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy2',
    section: 'Psychometric Analysis',
    text: 'I am not afraid to make mistakes when learning a new language.',
    options: [
      { text: 'Strongly Disagree', marks: 0 },
      { text: 'Disagree', marks: 0.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 1.5 },
      { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy3',
    section: 'Psychometric Analysis',
    text: 'I can consistently set aside time for studying every week.',
    options: [
      { text: 'Strongly Disagree', marks: 0 },
      { text: 'Disagree', marks: 0.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 1.5 },
      { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy4',
    section: 'Psychometric Analysis',
    text: 'I see learning German as a crucial step for my career advancement.',
    options: [
      { text: 'Strongly Disagree', marks: 0 },
      { text: 'Disagree', marks: 0.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 1.5 },
      { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy5',
    section: 'Psychometric Analysis',
    text: 'I enjoy challenging myself with difficult tasks.',
    options: [
      { text: 'Strongly Disagree', marks: 0 },
      { text: 'Disagree', marks: 0.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 1.5 },
      { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy6',
    section: 'Psychometric Analysis',
    text: 'When I face a setback, I tend to give up easily.',
    options: [ // Reverse scored
      { text: 'Strongly Disagree', marks: 2 },
      { text: 'Disagree', marks: 1.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 0.5 },
      { text: 'Strongly Agree', marks: 0 },
    ],
  },
  {
    id: 'psy7',
    section: 'Psychometric Analysis',
    text: 'I am comfortable practicing speaking with native speakers.',
    options: [
      { text: 'Strongly Disagree', marks: 0 },
      { text: 'Disagree', marks: 0.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 1.5 },
      { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy8',
    section: 'Psychometric Analysis',
    text: 'I actively look for opportunities to use the language I am learning.',
    options: [
      { text: 'Strongly Disagree', marks: 0 },
      { text: 'Disagree', marks: 0.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 1.5 },
      { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy9',
    section: 'Psychometric Analysis',
    text: 'I believe a structured learning plan is important for success.',
    options: [
      { text: 'Strongly Disagree', marks: 0 },
      { text: 'Disagree', marks: 0.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 1.5 },
      { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy10',
    section: 'Psychometric Analysis',
    text: 'I am patient and understand that language learning is a long-term process.',
    options: [
      { text: 'Strongly Disagree', marks: 0 },
      { text: 'Disagree', marks: 0.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 1.5 },
      { text: 'Strongly Agree', marks: 2 },
    ],
  },
];

const TOTAL_MARKS = 30;
const PASS_PERCENTAGE = 60;
const PASS_MARK = (TOTAL_MARKS * PASS_PERCENTAGE) / 100;

interface CounselorData {
  counselorNumber: string;
  languageClasses: {
    day: string;
    time: string;
    level: string;
  }[];
}

export default function AssessmentPage() {
  const [view, setView] = useState<'form' | 'results'>('form');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [counselorData, setCounselorData] = useState<CounselorData | null>(null);
  const { toast } = useToast();
  const { isStepUnlocked, completeStep } = useProgress();
  const router = useRouter();

  useEffect(() => {
    fetch('/counselor-data.json')
      .then((res) => res.json())
      .then(setCounselorData)
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load counselor information.',
        });
      });
  }, [toast]);

  if (!isStepUnlocked('assessment')) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Section Locked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please complete the previous steps in your pathway to unlock this assessment.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, marks: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: marks }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Test',
        description: 'Please answer all questions before submitting.',
      });
      return;
    }

    const totalScore = Object.values(answers).reduce((sum, marks) => sum + marks, 0);
    setScore(totalScore);

    if (totalScore >= PASS_MARK) {
      completeStep('assessment');
    }
    setView('results');
  };

  const resetTest = () => {
    setAnswers({});
    setScore(0);
    setView('form');
  };

  if (view === 'results') {
    const passed = score >= PASS_MARK;
    const scorePercentage = (score / TOTAL_MARKS) * 100;

    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <Card>
          <CardHeader className="items-center text-center">
            <CardTitle className="font-headline text-3xl">
              {passed ? 'Congratulations! Assessment Passed!' : 'Assessment Complete'}
            </CardTitle>
            <CardDescription>
              {passed
                ? "You've successfully passed the assessment."
                : 'You did not meet the passing score this time.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
                <g className="origin-center -rotate-90 transform">
                  <circle cx="18" cy="18" r="16" fill="none" className={`stroke-current ${passed ? 'text-green-500' : 'text-destructive'}`} strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - scorePercentage}></circle>
                </g>
              </svg>
              <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className={`text-4xl font-bold ${passed ? 'text-green-500' : 'text-destructive'}`}>
                  {Math.round(scorePercentage)}%
                </span>
                <p className="text-sm text-muted-foreground">
                  {score.toFixed(1)} / {TOTAL_MARKS} Marks
                </p>
              </div>
            </div>

            {passed ? (
              <div className="text-center">
                <CheckCircle className="mx-auto mb-2 h-12 w-12 text-green-500" />
                <p className="text-lg">
                  You are one step closer to your dream career in Germany!
                </p>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="mx-auto mb-2 h-12 w-12 text-destructive" />
                <p className="text-lg text-muted-foreground">
                  Don't worry, many successful nurses start with extra preparation. You needed{' '}
                  <span className="font-bold">{PASS_MARK}</span> marks to pass.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {counselorData && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We recommend speaking with one of our counselors to discuss your results and plan your next steps.</p>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <Phone />
                <div>
                  <p className="font-semibold">Counselor Contact</p>
                  <a href={`tel:${counselorData.counselorNumber}`} className="text-lg text-primary hover:underline">
                    {counselorData.counselorNumber}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {passed && counselorData && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Available Language Classes</CardTitle>
              <CardDescription>
                Here are the upcoming language classes you can join. Your counselor can help you enroll.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {counselorData.languageClasses.map((cls) => (
                  <li key={cls.day} className="flex justify-between rounded-md border p-3">
                    <div>
                      <p className="font-semibold">{cls.day}</p>
                      <p className="text-sm text-muted-foreground">{cls.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Level</p>
                      <p className="text-sm text-muted-foreground">{cls.level}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        <CardFooter className="justify-center gap-4">
          {!passed && <Button onClick={resetTest}>Retake Test</Button>}
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </CardFooter>
      </div>
    );
  }

  const renderSection = (sectionName: string) => (
    <div key={sectionName}>
       <h2 className="mb-6 mt-8 border-b pb-2 font-headline text-2xl font-semibold">
          {sectionName}
        </h2>
      <div className="space-y-8">
        {questions
          .filter((q) => q.section === sectionName)
          .map((question, index) => (
            <Card key={question.id} className="p-0">
              <CardHeader>
                <CardTitle className="text-lg">
                  Question {index + 1 + (sectionName === 'Psychometric Analysis' ? 5 : 0)}
                </CardTitle>
                <CardDescription className="pt-2 text-base text-foreground">
                  {question.text}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup onValueChange={(value) => handleAnswerChange(question.id, parseFloat(value))}>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <Label key={option.text} className="flex items-center space-x-3 rounded-md border p-4 hover:bg-accent has-[[data-state=checked]]:border-primary">
                        <RadioGroupItem value={String(option.marks)} id={`${question.id}-${option.text}`} />
                        <span>{option.text}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
  
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card className="p-0">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Career Readiness Assessment</CardTitle>
          <CardDescription>
            This mandatory test helps us understand your current skills and mindset. Please answer all questions honestly.
            You must score at least 60% to pass.
          </CardDescription>
        </CardHeader>
      </Card>
      <form onSubmit={handleSubmit}>
        {renderSection('English Proficiency')}
        {renderSection('Psychometric Analysis')}
        <CardFooter className="mt-8 justify-center">
          <Button type="submit" size="lg">
            Submit Assessment
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
