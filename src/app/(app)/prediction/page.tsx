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
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';
import { Check, Lightbulb, Loader2, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { migrationPrediction, type MigrationPredictionOutput } from '@/ai/flows/migration-prediction';
import { useToast } from '@/hooks/use-toast';

// Define types for the data we expect from localStorage
interface ProfileData {
  qualifications: string;
  skills: string;
  currentExperience: string; // e.g., "5 years at Berlin Charité Hospital"
  domainWorked: string;
  careerGap: boolean;
  careerGapYears?: number;
  resume?: boolean;
  languageCertificate?: boolean;
  graduationCertificate?: boolean;
  experienceCertificate?: boolean;
  employerOfferLetter?: boolean;
}
interface AssessmentData {
  score: number;
  scorePercentage: number;
}

const PredictionScoreGauge = ({ score }: { score: number }) => {
    const getScoreColor = () => {
        if (score > 80) return 'text-green-500';
        if (score > 60) return 'text-yellow-500';
        return 'text-red-500';
    };
    return (
        <div className="relative h-48 w-48">
            <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                    className="stroke-current text-gray-200 dark:text-gray-700"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                />
                <path
                    className={`stroke-current ${getScoreColor()} transition-all duration-1000`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3.5"
                    strokeDasharray={`${score}, 100`}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className={`text-5xl font-bold ${getScoreColor()}`}>
                    {Math.round(score)}
                </span>
                <p className="text-sm text-muted-foreground">/ 100</p>
            </div>
        </div>
    );
};


export default function PredictionPage() {
  const { isStepUnlocked, completeStep } = useProgress();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<MigrationPredictionOutput | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('mmb-profile-data');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
      const savedAssessment = localStorage.getItem('mmb-assessment-score');
      if (savedAssessment) {
        setAssessmentData(JSON.parse(savedAssessment));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Could not retrieve your profile or assessment data.",
      });
    } finally {
      setIsDataLoaded(true);
    }
  }, [toast]);


  if (!isStepUnlocked('prediction')) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Section Locked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please complete your profile and the assessment to unlock this feature.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleGeneratePrediction = async () => {
    if (!profileData || !assessmentData) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "We couldn't find your profile or assessment data. Please complete them first.",
      });
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    try {
      const experienceMatch = profileData.currentExperience.match(/(\d+)/);
      const totalExperienceYears = experienceMatch ? parseInt(experienceMatch[0], 10) : 0;

      const input = {
        qualifications: profileData.qualifications,
        skills: profileData.skills,
        totalExperienceYears: totalExperienceYears,
        domainWorked: profileData.domainWorked,
        hasCareerGap: profileData.careerGap,
        careerGapYears: profileData.careerGapYears,
        assessmentScorePercentage: assessmentData.scorePercentage,
        documentsUploaded: {
          resume: !!profileData.resume,
          languageCertificate: !!profileData.languageCertificate,
          graduationCertificate: !!profileData.graduationCertificate,
          experienceCertificate: !!profileData.experienceCertificate,
          employerOfferLetter: !!profileData.employerOfferLetter,
        },
      };

      const result = await migrationPrediction(input);
      setPrediction(result);
      completeStep('prediction');
      toast({
        title: 'Step Complete!',
        description:
          'Your prediction is ready and the next step on your pathway is now unlocked.',
      });

    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "There was an error generating your prediction. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2"><Sparkles className="text-primary"/> Migration Prediction</CardTitle>
          <CardDescription>
            Get an AI-powered analysis of your profile to estimate your readiness for a nursing career in Germany.
          </CardDescription>
        </CardHeader>
        {!prediction && (
          <CardFooter className="justify-center gap-4">
            <Button onClick={handleGeneratePrediction} disabled={isLoading || !isDataLoaded} size="lg">
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? 'Analyzing Profile...' : 'Generate My Prediction'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')} size="lg">
              Back to Dashboard
            </Button>
          </CardFooter>
        )}
      </Card>

      {prediction && (
         <Card>
          <CardHeader className="items-center text-center">
            <CardTitle className="font-headline text-2xl">Your Prediction Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <PredictionScoreGauge score={prediction.predictionScore} />
            <p className="max-w-prose text-center text-muted-foreground">{prediction.summary}</p>
          </CardContent>
          <CardFooter className="justify-center gap-4">
             <Button onClick={handleGeneratePrediction} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? 'Re-analyzing...' : 'Regenerate Prediction'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}

      {prediction && (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-green-600"><ThumbsUp /> Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc space-y-2 pl-5">
                        {prediction.strengths.map((item, i) => <li key={i} className="text-muted-foreground">{item}</li>)}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-amber-600"><ThumbsDown /> Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="list-disc space-y-2 pl-5">
                        {prediction.areasForImprovement.map((item, i) => <li key={i} className="text-muted-foreground">{item}</li>)}
                    </ul>
                </CardContent>
            </Card>
             <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-blue-600"><Lightbulb /> Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="list-disc space-y-2 pl-5">
                        {prediction.recommendations.map((item, i) => <li key={i} className="text-muted-foreground">{item}</li>)}
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
