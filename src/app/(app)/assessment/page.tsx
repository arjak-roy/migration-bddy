'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  germanReadinessAssessment,
  type GermanReadinessAssessmentOutput,
} from '@/ai/flows/german-readiness-assessment';
import {
  personalizeLanguageRecommendations,
  type PersonalizeLanguageRecommendationsOutput,
} from '@/ai/flows/personalized-language-recommendations';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  priorLanguageLearningExperience: z
    .string()
    .min(10, 'Please describe your experience in a bit more detail.'),
  germanSentenceAttempt: z
    .string()
    .min(3, 'Please attempt a simple German sentence.'),
  reasonForLearningGerman: z
    .string()
    .min(10, 'Please tell us why you want to learn German.'),
  proficiencyLevel: z.string({
    required_error: 'Please select your estimated proficiency level.',
  }),
});

type AssessmentFormValues = z.infer<typeof formSchema>;

export default function AssessmentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] =
    useState<GermanReadinessAssessmentOutput | null>(null);
  const [recommendations, setRecommendations] =
    useState<PersonalizeLanguageRecommendationsOutput | null>(null);
  const { toast } = useToast();
  const { isStepUnlocked, completeStep } = useProgress();
  const router = useRouter();

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priorLanguageLearningExperience: '',
      germanSentenceAttempt: '',
      reasonForLearningGerman: '',
    },
  });

  if (!isStepUnlocked('assessment')) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Section Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please complete the previous steps in your pathway to unlock this
              assessment.
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

  async function onSubmit(values: AssessmentFormValues) {
    setIsLoading(true);
    setAssessmentResult(null);
    setRecommendations(null);

    try {
      const assessmentOutput = await germanReadinessAssessment(values);
      setAssessmentResult(assessmentOutput);
      completeStep('assessment');

      if (assessmentOutput) {
        const recommendationsOutput = await personalizeLanguageRecommendations({
          proficiencyLevel: values.proficiencyLevel,
          areasOfWeakness: assessmentOutput.weaknesses,
          learningStyle: 'visual',
          timeAvailability: '5-10 hours',
        });
        setRecommendations(recommendationsOutput);
      }
    } catch (error) {
      console.error('Assessment failed:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          'There was a problem with the assessment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      {!assessmentResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              German Readiness Assessment
            </CardTitle>
            <CardDescription>
              Answer a few questions to get AI-powered feedback on your German
              learning aptitude and personalized recommendations.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="priorLanguageLearningExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What is your prior language learning experience?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I studied French in high school for 2 years...' or 'This is my first time learning a new language.'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="germanSentenceAttempt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Attempt a simple sentence in German.
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 'Ich bin Krankenschwester' or 'Ich möchte in Deutschland arbeiten.'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reasonForLearningGerman"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What is your primary motivation for learning German?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'To work as a registered nurse in Berlin and immerse myself in the culture.'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proficiencyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What is your estimated German proficiency level?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a level (e.g., A1, B2)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A1">A1 (Beginner)</SelectItem>
                          <SelectItem value="A2">A2 (Elementary)</SelectItem>
                          <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                          <SelectItem value="B2">
                            B2 (Upper-Intermediate)
                          </SelectItem>
                          <SelectItem value="C1">C1 (Advanced)</SelectItem>
                          <SelectItem value="C2">C2 (Proficient)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? 'Assessing...' : 'Get My Assessment'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">
                Your Assessment is Complete!
              </CardTitle>
              <CardDescription>
                {assessmentResult.feedbackSummary}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative h-32 w-32">
                <svg
                  className="h-full w-full"
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-current text-gray-200 dark:text-gray-700"
                    strokeWidth="2"
                  ></circle>
                  <g className="origin-center -rotate-90 transform">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-current text-primary"
                      strokeWidth="2"
                      strokeDasharray="100"
                      strokeDashoffset={
                        100 - (assessmentResult.aptitudeScore || 0)
                      }
                    ></circle>
                  </g>
                </svg>
                <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-center text-3xl font-bold text-primary">
                    {assessmentResult.aptitudeScore}
                  </span>
                </div>
              </div>
              <p className="text-lg font-semibold">Aptitude Score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Feedback</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold">Strengths</h4>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  {assessmentResult.strengths.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Areas for Improvement</h4>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  {assessmentResult.weaknesses.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-4 font-headline text-2xl font-bold">
              Personalized Learning Resources
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading && !recommendations && (
                <p>Generating recommendations...</p>
              )}
              {recommendations?.recommendations.map((rec, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{rec.name}</CardTitle>
                    <CardDescription>{rec.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      {rec.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {rec.focusAreas.map((area) => (
                        <div
                          key={area}
                          className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          {area}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Resource{' '}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
