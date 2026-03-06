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
import { Award, BookOpen, Loader2, Phone, XCircle } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';

const englishQuestionPool = [
  {
    id: 'eng1',
    section: 'English Proficiency',
    text: 'Which sentence is grammatically correct for a medical chart?',
    options: [
      { text: 'Patient reports pain in their leg.', marks: 2 },
      { text: 'The patient, he said his leg hurts.', marks: 0 },
      { text: 'There is pain being felt by the patient in the leg.', marks: 0 },
    ],
  },
  {
    id: 'eng2',
    section: 'English Proficiency',
    text: 'The patient\'s condition has ______ deteriorated overnight.',
    options: [
      { text: 'significant', marks: 0 },
      { text: 'significantly', marks: 2 },
      { text: 'significance', marks: 0 },
    ],
  },
  {
    id: 'eng3',
    section: 'English Proficiency',
    text: 'What does the medical abbreviation "NPO" stand for?',
    options: [
      { text: 'Nothing by mouth', marks: 2 },
      { text: 'New patient only', marks: 0 },
      { text: 'No previous operation', marks: 0 },
    ],
  },
  {
    id: 'eng4',
    section: 'English Proficiency',
    text: 'If a patient is "ambulatory," it means they are:',
    options: [
      { text: 'In critical condition', marks: 0 },
      { text: 'Able to walk', marks: 2 },
      { text: 'Scheduled for surgery', marks: 0 },
    ],
  },
  {
    id: 'eng5',
    section: 'English Proficiency',
    text: 'Choose the best word to complete the sentence: "The nurse must ______ the patient\'s vital signs every hour."',
    options: [
      { text: 'Monitor', marks: 2 },
      { text: 'View', marks: 0 },
      { text: 'Control', marks: 0 },
    ],
  },
  {
    id: 'eng6',
    section: 'English Proficiency',
    text: 'A patient with a history of syncope should be monitored for signs of ______.',
    options: [
      { text: 'seizures', marks: 0 },
      { text: 'fainting', marks: 2 },
      { text: 'bleeding', marks: 0 },
    ],
  },
  {
    id: 'eng7',
    section: 'English Proficiency',
    text: 'The doctor ordered a CBC. What does the \'C\' stand for in this context?',
    options: [
      { text: 'Cardiac', marks: 0 },
      { text: 'Complete', marks: 2 },
      { text: 'Cellular', marks: 0 },
    ],
  },
  {
    id: 'eng8',
    section: 'English Proficiency',
    text: '"Please administer the medication subcutaneously." This means the injection is given:',
    options: [
      { text: 'Into the muscle', marks: 0 },
      { text: 'Into the vein', marks: 0 },
      { text: 'Under the skin', marks: 2 },
    ],
  },
  {
    id: 'eng9',
    section: 'English Proficiency',
    text: 'Which is the correct medical term for a heart rate that is faster than normal?',
    options: [
      { text: 'Bradycardia', marks: 0 },
      { text: 'Tachycardia', marks: 2 },
      { text: 'Arrhythmia', marks: 0 },
    ],
  },
    {
    id: 'eng10',
    section: 'English Proficiency',
    text: 'The instruction "prn" on a medication order means the nurse should administer it:',
    options: [
      { text: 'Every morning', marks: 0 },
      { text: 'Immediately', marks: 0 },
      { text: 'As needed', marks: 2 },
    ],
  },
];

const psychometricQuestionPool = [
  {
    id: 'psy1',
    section: 'Psychometric Analysis',
    text: 'When I encounter a complex topic I don\'t understand, my first instinct is to find resources to teach myself.',
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
    text: 'I view critical feedback not as a personal failure, but as a valuable tool for growth.',
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
    text: 'Even during a very busy week, I can protect my scheduled study time from other commitments.',
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
    text: 'My motivation to learn German comes from a deep interest in the culture and communication, not just career requirements.',
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
    text: 'I am more energized by a problem that takes several attempts to solve than one I can solve immediately.',
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
    text: 'A significant professional setback would likely make me question my career path for an extended period.',
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
    text: 'I would initiate a conversation in German with a stranger, even if I was unsure of my grammar.',
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
    text: 'When faced with a misunderstanding due to language barriers, I systematically try different ways to rephrase my message until I am understood.',
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
    text: 'If my current study method isn\'t producing results, I am quick to research and adopt a new strategy.',
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
    text: 'I can maintain high motivation for a goal that is more than a year away, even with slow, incremental progress.',
    options: [
      { text: 'Strongly Disagree', marks: 0 },
      { text: 'Disagree', marks: 0.5 },
      { text: 'Neutral', marks: 1 },
      { text: 'Agree', marks: 1.5 },
      { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy11',
    section: 'Psychometric Analysis',
    text: 'When a patient is uncooperative, I find it easy to remain patient and calm.',
    options: [
        { text: 'Strongly Disagree', marks: 0 },
        { text: 'Disagree', marks: 0.5 },
        { text: 'Neutral', marks: 1 },
        { text: 'Agree', marks: 1.5 },
        { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy12',
    section: 'Psychometric Analysis',
    text: 'I prefer a predictable daily routine over having to adapt to new situations frequently.',
    options: [ // Reverse scored
        { text: 'Strongly Disagree', marks: 2 },
        { text: 'Disagree', marks: 1.5 },
        { text: 'Neutral', marks: 1 },
        { text: 'Agree', marks: 0.5 },
        { text: 'Strongly Agree', marks: 0 },
    ],
  },
  {
    id: 'psy13',
    section: 'Psychometric Analysis',
    text: 'Learning a new, complex clinical procedure is an exciting challenge for me.',
    options: [
        { text: 'Strongly Disagree', marks: 0 },
        { text: 'Disagree', marks: 0.5 },
        { text: 'Neutral', marks: 1 },
        { text: 'Agree', marks: 1.5 },
        { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy14',
    section: 'Psychometric Analysis',
    text: 'It is more important to follow hospital protocol exactly in all cases than to adapt care to a patient\'s unique emotional needs.',
    options: [ // Reverse scored
        { text: 'Strongly Disagree', marks: 2 },
        { text: 'Disagree', marks: 1.5 },
        { text: 'Neutral', marks: 1 },
        { text: 'Agree', marks: 0.5 },
        { text: 'Strongly Agree', marks: 0 },
    ],
  },
  {
    id: 'psy15',
    section: 'Psychometric Analysis',
    text: 'I feel a strong sense of personal responsibility for my patients\' well-being and outcomes.',
    options: [
        { text: 'Strongly Disagree', marks: 0 },
        { text: 'Disagree', marks: 0.5 },
        { text: 'Neutral', marks: 1 },
        { text: 'Agree', marks: 1.5 },
        { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy16',
    section: 'Psychometric Analysis',
    text: 'After a long and emotionally draining shift, I am able to detach from work and relax at home.',
    options: [
        { text: 'Strongly Disagree', marks: 0 },
        { text: 'Disagree', marks: 0.5 },
        { text: 'Neutral', marks: 1 },
        { text: 'Agree', marks: 1.5 },
        { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy17',
    section: 'Psychometric Analysis',
    text: 'I am comfortable asking for help from senior colleagues when I am unsure about a patient\'s care plan.',
    options: [
        { text: 'Strongly Disagree', marks: 0 },
        { text: 'Disagree', marks: 0.5 },
        { text: 'Neutral', marks: 1 },
        { text: 'Agree', marks: 1.5 },
        { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy18',
    section: 'Psychometric Analysis',
    text: 'I often reflect on how I could have handled a past clinical situation more effectively.',
    options: [
        { text: 'Strongly Disagree', marks: 0 },
        { text: 'Disagree', marks: 0.5 },
        { text: 'Neutral', marks: 1 },
        { text: 'Agree', marks: 1.5 },
        { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy19',
    section: 'Psychometric Analysis',
    text: 'Moving to a new country where I don\'t know anyone seems like an exciting adventure rather than a daunting obstacle.',
    options: [
        { text: 'Strongly Disagree', marks: 0 },
        { text: 'Disagree', marks: 0.5 },
        { text: 'Neutral', marks: 1 },
        { text: 'Agree', marks: 1.5 },
        { text: 'Strongly Agree', marks: 2 },
    ],
  },
  {
    id: 'psy20',
    section: 'Psychometric Analysis',
    text: 'I find it difficult to speak up if I disagree with a doctor\'s order, even if I believe it may be incorrect.',
    options: [ // Reverse scored
        { text: 'Strongly Disagree', marks: 2 },
        { text: 'Disagree', marks: 1.5 },
        { text: 'Neutral', marks: 1 },
        { text: 'Agree', marks: 0.5 },
        { text: 'Strongly Agree', marks: 0 },
    ],
  },
];


const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};


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
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'form' | 'results'>('form');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [counselorData, setCounselorData] = useState<CounselorData | null>(null);
  const { toast } = useToast();
  const { isStepUnlocked, completeStep } = useProgress();
  const router = useRouter();

  useEffect(() => {
    const selectedEnglish = shuffleArray(englishQuestionPool).slice(0, 5);
    const selectedPsychometric = shuffleArray(psychometricQuestionPool).slice(0, 10);
    setQuestions([...selectedEnglish, ...selectedPsychometric]);
    setIsLoading(false);

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
  
  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Loading Assessment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Preparing your questions...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }


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
    const scorePercentage = (totalScore / TOTAL_MARKS) * 100;
    setScore(totalScore);

    try {
      localStorage.setItem('mmb-assessment-score', JSON.stringify({ score: totalScore, scorePercentage }));
    } catch (error) {
        console.error("Failed to save assessment score to localStorage", error);
    }

    if (totalScore >= PASS_MARK) {
      completeStep('assessment');
    }
    setView('results');
  };

  const resetTest = () => {
    setAnswers({});
    setScore(0);
    setView('form');
    // Reshuffle questions for the new attempt
    setIsLoading(true);
    const selectedEnglish = shuffleArray(englishQuestionPool).slice(0, 5);
    const selectedPsychometric = shuffleArray(psychometricQuestionPool).slice(0, 10);
    setQuestions([...selectedEnglish, ...selectedPsychometric]);
    setIsLoading(false);
  };

  if (view === 'results') {
    const passed = score >= PASS_MARK;
    const scorePercentage = (score / TOTAL_MARKS) * 100;

    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <Card className={`border-2 ${passed ? 'border-green-500' : 'border-destructive'}`}>
          <CardHeader className="items-center text-center">
            {passed ? (
              <Award className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="mx-auto h-16 w-16 text-destructive" />
            )}
            <CardTitle className="pt-2 font-headline text-3xl">
              {passed ? 'Congratulations! Assessment Passed!' : 'Assessment Complete'}
            </CardTitle>
            <CardDescription className="text-base">
              {passed
                ? "You've successfully passed the assessment and are ready for the next step."
                : 'You did not meet the passing score this time. Please review your answers and try again.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
                <g className="origin-center -rotate-90 transform">
                  <circle cx="18" cy="18" r="16" fill="none" className={`stroke-current ${passed ? 'text-green-500' : 'text-destructive'}`} strokeWidth="2.5" strokeDasharray="100" strokeDashoffset={100 - scorePercentage}></circle>
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
              <div className="text-center text-lg">
                <p>
                  You are one step closer to your dream career in Germany!
                </p>
              </div>
            ) : (
              <div className="text-center text-lg">
                <p className="text-muted-foreground">
                  You needed{' '}
                  <span className="font-bold text-foreground">{PASS_MARK}</span> marks to pass. Don't worry, many successful nurses start with extra preparation.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {passed && counselorData && (
          <>
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-green-700 dark:text-green-400">
                  <Phone />
                  Next Steps
                </CardTitle>
                <CardDescription>
                  A Global Migration Executive will contact you shortly to discuss your results and enroll you in the next batch.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 rounded-lg border bg-background p-4">
                  <Phone className="text-green-700 dark:text-green-400" />
                  <div>
                    <p className="font-semibold">For any questions, you can reach us at:</p>
                    <p className="text-lg text-green-700 dark:text-green-400">
                      {counselorData.counselorNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-accent-foreground">
                  <BookOpen />
                  Next Batch Details
                </CardTitle>
                <CardDescription>
                  Here are the details for the upcoming language classes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {counselorData.languageClasses.map((cls) => (
                    <li key={cls.day} className="flex justify-between rounded-md border bg-background p-3">
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
          </>
        )}
        
        {!passed && counselorData && (
          <Card className="bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-destructive">
                <Phone />
                Need Assistance?
              </CardTitle>
              <CardDescription>
                Please contact a counselor to discuss your results and get guidance on how to improve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 rounded-lg border bg-background p-4">
                <Phone className="text-destructive"/>
                <div>
                  <p className="font-semibold">Counselor Contact</p>
                  <a href={`tel:${counselorData.counselorNumber}`} className="text-lg text-destructive hover:underline">
                    {counselorData.counselorNumber}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <CardFooter className="justify-center gap-4 pt-4">
          {!passed && <Button onClick={resetTest} size="lg">Retake Test</Button>}
          <Button onClick={() => router.push('/dashboard')} variant="outline" size="lg">
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
            <Card
              key={question.id}
              className="overflow-hidden border-l-4 border-primary/50 transition-all hover:border-primary"
            >
              <CardHeader>
                <CardTitle className="text-lg">
                  Question{' '}
                  {index + 1 + (sectionName === 'Psychometric Analysis' ? 5 : 0)}
                </CardTitle>
                <CardDescription className="pt-2 text-base text-foreground">
                  {question.text}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(optionIndexStr) => {
                    const optionIndex = parseInt(optionIndexStr, 10);
                    const selectedOption = question.options[optionIndex];
                    if (selectedOption) {
                      handleAnswerChange(question.id, selectedOption.marks);
                    }
                  }}
                >
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <Label
                        key={option.text}
                        className="flex cursor-pointer items-center space-x-3 rounded-md border p-4 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 has-[[data-state=checked]]:text-primary"
                      >
                        <RadioGroupItem
                          value={String(optionIndex)}
                          id={`${question.id}-${option.text}`}
                        />
                        <span className="font-medium">{option.text}</span>
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
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Logo className="h-16 w-16 shrink-0" />
            <div>
              <CardTitle className="font-headline text-3xl">German Readiness Assessment</CardTitle>
              <CardDescription className="text-base">
                This mandatory test helps us understand your current skills and mindset. Please answer all questions honestly.
                You must score at least {PASS_PERCENTAGE}% to pass.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      <form onSubmit={handleSubmit}>
        {renderSection('English Proficiency')}
        {renderSection('Psychometric Analysis')}
        <CardFooter className="mt-8 justify-center">
          <Button type="submit" size="lg" className="w-full max-w-xs">
            Submit Assessment
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
