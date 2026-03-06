'use client';

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
import { ExternalLink, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const opportunities = [
  {
    name: 'Germany',
    flag: '🇩🇪',
    description: 'High demand for nurses, excellent healthcare system, and strong social security. Proficiency in German (B1/B2 level) is a key requirement.',
    link: 'https://www.make-it-in-germany.com/en/working-in-germany/professions-in-demand/nurses',
  },
  {
    name: 'Canada',
    flag: '🇨🇦',
    description: 'A popular destination with a streamlined immigration process for healthcare professionals through programs like Express Entry.',
    link: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html',
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    description: 'Offers a high quality of life and competitive salaries. Nurses are in high demand, but the skills assessment process is rigorous.',
    link: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list',
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    description: 'The NHS is a major employer of international nurses. A Health and Care Worker visa is the standard route.',
    link: 'https://www.gov.uk/health-care-worker-visa',
  },
  {
    name: 'United States',
    flag: '🇺🇸',
    description: 'High salaries are a major draw, but the process involves passing the NCLEX exam and navigating a complex visa system.',
    link: 'https://www.ncsbn.org/public-files/nclex_faqs.pdf',
  },
    {
    name: 'New Zealand',
    flag: '🇳🇿',
    description: 'Known for its work-life balance. Nurses are on the "Green List" of in-demand roles, simplifying the residency pathway.',
    link: 'https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/working-in-nz/qualifications-for-work/green-list-occupations',
  },
  {
    name: 'Ireland',
    flag: '🇮🇪',
    description: 'An English-speaking EU country with a strong demand for nurses in both public and private sectors.',
    link: 'https://www.nmbi.ie/Registration/Trained-outside-Ireland',
  },
   {
    name: 'Switzerland',
    flag: '🇨🇭',
    description: 'Offers some of the highest nursing salaries in the world, but has high living costs and requires proficiency in German, French, or Italian.',
    link: 'https://www.redcross.ch/en/our-services/recognition-foreign-qualifications',
  },
];

export default function JobsPage() {
  const { isStepUnlocked } = useProgress();
  const router = useRouter();

  if (!isStepUnlocked('jobs')) {
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
              Please complete the previous steps in your pathway to unlock job
              listings.
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold flex items-center justify-center gap-2">
            <Globe /> Global Nursing Opportunities
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore popular countries for nurse migration and their requirements.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {opportunities.map((country) => (
            <Card key={country.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                    <span className="text-5xl">{country.flag}</span>
                    <span className="text-2xl">{country.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {country.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <a href={country.link} target="_blank" rel="noopener noreferrer">
                    Learn More <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
